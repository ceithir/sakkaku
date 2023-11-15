import { useState } from "react";
import { Form, Input, Button, InputNumber, Divider, Typography } from "antd";
import styles from "./Roller.module.less";
import { parse } from "./formula";
import UserContext from "components/form/UserContext";
import Result from "./TextResult";
import ExternalLink from "features/navigation/ExternalLink";
import { bbMessage } from "./IdentifiedRoll";

const { Text } = Typography;

const Syntax = () => {
  return (
    <div className={styles.syntax}>
      <Text type="secondary">
        <p>
          {`Syntax must comply with `}
          <ExternalLink
            href={`https://en.wikipedia.org/wiki/Dice_notation`}
          >{`standard dice notation`}</ExternalLink>
          {`, like:`}
        </p>
        <ul>
          <li>{`2d6`}</li>
          <li>{`1d20+3`}</li>
          <li>{`1d12-3+1d4+2`}</li>
          <li>{`3d6kh2`}</li>
          <li>{`2d20kl1`}</li>
          <li>{`5d10k3!+5`}</li>
        </ul>
      </Text>
    </div>
  );
};

export const Roller = ({ loading, setLoading, clearResult, createRoll }) => {
  const [parsedFormula, setParsedFormula] = useState();

  return (
    <Form
      onValuesChange={(_, { formula }) => {
        setParsedFormula(parse(formula));
        clearResult();
      }}
      onFinish={({ formula, tn, ...values }) => {
        setLoading(true);
        clearResult();

        const parameters = {
          ...parse(formula),
          tn,
        };
        const metadata = {
          original: formula,
        };

        createRoll({
          uri: "/dnd/rolls/create",
          parameters,
          metadata,
          userData: values,
          result: (data) => {
            if (!data.id) {
              return { content: <Result {...data} /> };
            }

            const {
              roll,
              description,
              result: { total },
            } = data;
            const { parameters } = roll;
            return {
              content: <Result {...roll} />,
              bbMessage: bbMessage({ parameters, description, total }),
            };
          },
        });
      }}
    >
      <UserContext />
      <Form.Item
        label={`Dice`}
        name="formula"
        rules={[
          { required: true, message: `Please enter what you wish to roll` },
        ]}
      >
        <Input placeholder={`2d6`} />
      </Form.Item>
      <Form.Item label={`Target number`} name="tn">
        <InputNumber />
      </Form.Item>
      <Divider />
      <Syntax />
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          disabled={!parsedFormula}
          loading={loading}
        >
          {`Roll`}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Roller;
