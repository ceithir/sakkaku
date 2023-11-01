import React, { useState } from "react";
import Title from "./Title";
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
import { parse } from "./formula";
import DefaultErrorMessage from "DefaultErrorMessage";
import styles from "./D10Roller.module.less";
import UserContext from "components/form/UserContext";
import { selectUser } from "features/user/reducer";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames";
import TextSummary from "./TextSummary";
import { prepareFinish } from "./form";
import FormResult from "./FormResult";

const { Text } = Typography;
const { Panel } = Collapse;

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

const D10Roller = () => {
  const [parsedFormula, setParsedFormula] = useState();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();
  const [params, setParams] = useState({
    explosions: [
      ...initialValues.otherExplosions,
      ...(initialValues.explodeOnTen ? [10] : []),
    ],
    rerolls: initialValues.rerolls,
    select: initialValues.select,
    tn: initialValues.tn,
  });
  const [context, setContext] = useState();
  const [showMeTheOdds, setShowMeTheOdds] = useState();

  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [form] = Form.useForm();

  if (error) {
    return <DefaultErrorMessage />;
  }

  return (
    <div className={styles.background}>
      <Title />
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
          setResult(undefined);
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
          const {
            formula,
            explodeOnTen,
            otherExplosions = initialValues.otherExplosions,
          } = values;

          prepareFinish({
            setLoading,
            setResult,
            setContext,
            setError,
            dispatch,
            user,
          })({
            ...initialValues,
            ...values,
            explosions: [...otherExplosions, ...(explodeOnTen ? [10] : [])],
            metadata: {
              original: formula,
            },
          });
        }}
        className={classNames(styles.form, {
          [styles["fix-user-switch"]]: !!user,
        })}
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
        <Collapse className={styles["extra-options"]}>
          <Panel header={`More options`}>
            <Form.Item label={`Dice also explode on`} name="otherExplosions">
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
              label={`Show me the odds`}
              name="showMeTheOdds"
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>
          </Panel>
        </Collapse>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {`Roll`}
          </Button>
        </Form.Item>
      </Form>
      <FormResult result={result} context={context} loading={loading} />
    </div>
  );
};

export default D10Roller;
