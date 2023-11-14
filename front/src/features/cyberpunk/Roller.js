import { Form, Input, Button, InputNumber } from "antd";
import styles from "./Roller.module.less";
import { postOnServer, authentifiedPostOnServer } from "server";
import { pattern, parse } from "./formula";
import UserContext from "components/form/UserContext";
import TextResult from "./TextResult";
import { bbMessage } from "./Roll";

const Roller = ({
  loading,
  setLoading,
  ajaxError,
  updateResult,
  clearResult,
}) => {
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

        const { testMode, campaign, character, description } = values;
        const stateless = testMode || !campaign;

        if (stateless) {
          postOnServer({
            uri: "/public/cyberpunk/rolls/create",
            body: {
              parameters,
              metadata,
            },
            success: ({ parameters, dice }) =>
              updateResult(<TextResult parameters={parameters} dice={dice} />),
            error: ajaxError,
          });
          return;
        }

        authentifiedPostOnServer({
          uri: "/cyberpunk/rolls/create",
          body: {
            parameters,
            metadata,
            campaign,
            character,
            description,
          },
          success: ({
            roll: { parameters, dice },
            id,
            result: { total },
            description,
            campaign,
            character,
          }) => {
            updateResult(<TextResult parameters={parameters} dice={dice} />, {
              id,
              campaign,
              character,
              bbMessage: bbMessage({ description, total, parameters }),
              description,
            });
          },
          error: ajaxError,
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
