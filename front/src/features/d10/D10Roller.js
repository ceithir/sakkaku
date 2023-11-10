import { useState } from "react";
import {
  Form,
  Input,
  Typography,
  Button,
  InputNumber,
  Checkbox,
  Radio,
  Collapse,
} from "antd";
import { parse, cap } from "./formula";
import styles from "./D10Roller.module.less";
import UserContext from "components/form/UserContext";
import { selectUser } from "features/user/reducer";
import { useSelector } from "react-redux";
import TextSummary from "./TextSummary";
import ExternalLink from "features/navigation/ExternalLink";
import { postOnServer, authentifiedPostOnServer } from "server";
import RollResult from "./RollResult";
import { bbMessage } from "./D10IdentifiedRoll";

const { Text } = Typography;

const initialValues = {
  rerolls: [],
  select: "high",
  explodeOnTen: true,
  otherExplosions: [],
};

const Syntax = () => {
  return (
    <Text type="danger" className={styles.syntax}>
      {`Please enter a standard L5R syntax, the like of:`}
      <ul>
        <li>{`6k3`}</li>
        <li>{`2k2+1k1`}</li>
        <li>{`7k4-3+5`}</li>
      </ul>
    </Text>
  );
};

const D10Roller = ({
  loading,
  setLoading,
  ajaxError,
  updateResult,
  clearResult,
}) => {
  const [parsedFormula, setParsedFormula] = useState();
  const [params, setParams] = useState({
    explosions: [
      ...initialValues.otherExplosions,
      ...(initialValues.explodeOnTen ? [10] : []),
    ],
    rerolls: initialValues.rerolls,
    select: initialValues.select,
    tn: initialValues.tn,
  });
  const [showMeTheOdds, setShowMeTheOdds] = useState();

  const user = useSelector(selectUser);

  const [form] = Form.useForm();

  return (
    <Form
      onValuesChange={(
        changedValues,
        {
          formula,
          explodeOnTen,
          tn,
          otherExplosions = initialValues.otherExplosions,
          rerolls = initialValues.rerolls,
          select = initialValues.select,
          showMeTheOdds,
        }
      ) => {
        setParsedFormula(parse(formula));
        setParams({
          explosions: [...otherExplosions, ...(explodeOnTen ? [10] : [])],
          rerolls,
          select,
          tn,
        });
        clearResult();
        setShowMeTheOdds(showMeTheOdds);

        // Trickery to revalidate on each if alreayd in error
        if (Object.keys(changedValues).includes("formula")) {
          if (
            form
              .getFieldInstance("formula")
              ?.input?.classList?.contains("ant-input-status-error")
          ) {
            form.validateFields(["formula"]);
          }
        }
      }}
      onFinish={(values) => {
        const allValues = { ...initialValues, ...values };

        const {
          formula,
          tn,
          explodeOnTen,
          otherExplosions,
          rerolls,
          select,

          campaign,
          character,
          description,
          testMode,
        } = allValues;

        const explosions = [...otherExplosions, ...(explodeOnTen ? [10] : [])];
        const metadata = {
          original: formula,
        };

        setLoading(true);
        clearResult();

        const parsedFormula = parse(formula);
        const repeat = parsedFormula.repeat || 1;
        let done = 0;
        let results = [];
        const update = (result) => {
          results.push(result);
          done++;
          if (done >= repeat) {
            updateResult(results);
          }
        };

        const parameters = {
          ...cap(parsedFormula),
          tn,
          explosions,
          rerolls,
          select,
        };

        for (let i = 0; i < repeat; i++) {
          if (!user || testMode) {
            postOnServer({
              uri: "/public/aeg/l5r/rolls/create",
              body: {
                parameters,
                metadata,
              },
              success: ({ dice, parameters }) =>
                update({
                  content: <RollResult dice={dice} parameters={parameters} />,
                }),
              error: ajaxError,
            });
          } else {
            authentifiedPostOnServer({
              uri: "/aeg/l5r/rolls/create",
              body: {
                parameters,
                campaign,
                character,
                description:
                  repeat > 1 ? description + ` – Roll #${i + 1}` : description,
                metadata,
              },
              success: ({ roll, id, character, campaign, description }) =>
                update({
                  content: <RollResult {...roll} />,
                  id,
                  character,
                  campaign,
                  bbMessage: bbMessage({ description, roll }),
                }),
              error: ajaxError,
            });
          }
        }
      }}
      initialValues={initialValues}
      form={form}
    >
      <UserContext />
      <Form.Item
        label={`Your dice pool`}
        name="formula"
        validateTrigger={["onBlur"]}
        rules={[
          { required: true, message: `Please enter what you wish to roll` },
          () => ({
            validator: (_, value) => {
              if (!value) {
                return Promise.resolve();
              }
              if (!!parse(value)) {
                return Promise.resolve();
              }
              return Promise.reject(`Bad syntax`);
            },
            message: <Syntax />,
          }),
        ]}
      >
        <Input placeholder={`5k4 +1k0 -5`} />
      </Form.Item>
      <div className={styles.inlined}>
        <Form.Item label={`TN`} name="tn">
          <InputNumber />
        </Form.Item>
        <Form.Item
          label={`Exploding 10`}
          name="explodeOnTen"
          valuePropName="checked"
        >
          <Checkbox />
        </Form.Item>
      </div>

      {!!parsedFormula ? (
        <TextSummary
          original={parsedFormula}
          showMeTheOdds={showMeTheOdds}
          {...params}
        />
      ) : (
        <div className={styles.placeholder}>{`💮`}</div>
      )}
      <Collapse
        className={styles["extra-options"]}
        items={[
          {
            key: "1",
            label: `More options`,
            children: (
              <>
                <Form.Item
                  label={`Dice also explode on`}
                  name="otherExplosions"
                >
                  <Checkbox.Group
                    options={[
                      { label: 8, value: 8 },
                      { label: 9, value: 9 },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  label={`Reroll (once)`}
                  name="rerolls"
                  tooltip={`Check "1" to apply a 4th edition Emphasis [see Core, page 133]`}
                >
                  <Checkbox.Group
                    options={[
                      { label: 1, value: 1 },
                      { label: 2, value: 2 },
                      { label: 3, value: 3 },
                    ]}
                  />
                </Form.Item>
                <Form.Item label={`Keep`} name="select">
                  <Radio.Group
                    options={[
                      { value: "high", label: `Highest dice` },
                      { value: "low", label: `Lowest dice` },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  label={
                    <>
                      {`Show me the odds (`}
                      <ExternalLink href="https://lynks.se/probability/">{`source`}</ExternalLink>
                      {`)`}
                    </>
                  }
                  name="showMeTheOdds"
                  valuePropName="checked"
                >
                  <Checkbox />
                </Form.Item>
              </>
            ),
          },
        ]}
      />
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {`Roll`}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default D10Roller;
