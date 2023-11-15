import { Form, Input, Button, InputNumber } from "antd";
import styles from "./Roller.module.less";
import { pattern, parse } from "./formula";
import UserContext from "components/form/UserContext";
import TextResult from "./TextResult";
import { bbMessage } from "./Roll";

const Roller = ({ loading, setLoading, clearResult, createRoll }) => {
  return (
    <Form
      onFinish={({ formula, tn, ...values }) => {
        setLoading(true);
        clearResult();

        const parameters = {
          modifier: parse(formula) || 0,
          tn,
        };
        const metadata = {
          original: formula,
        };

        createRoll({
          uri: "/cyberpunk/rolls/create",
          parameters,
          metadata,
          userData: values,
          result: (data) => {
            if (!data.id) {
              return { content: <TextResult {...data} /> };
            }

            const {
              roll,
              description,
              result: { total },
            } = data;
            const { parameters } = roll;
            return {
              content: <TextResult {...roll} />,
              bbMessage: bbMessage({ description, total, parameters }),
            };
          },
        });
      }}
    >
      <UserContext />
      <div className={styles.formula}>
        <span>{`"1d10"`}</span>
        <span>{` + `}</span>
        <Form.Item
          name="formula"
          rules={[
            {
              pattern,
              message: `Unrecognized syntax`,
            },
          ]}
        >
          <Input placeholder={`2+5-3`} />
        </Form.Item>
      </div>
      <div className={styles.explanation}>
        {`"1d10": Standard d10, except exploding once on a 10 and exploding once `}
        <em>{`downwards`}</em>
        {` on a 1.`}
      </div>
      <Form.Item label={`Target number`} name="tn">
        <InputNumber />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {`Roll`}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Roller;
