import { Form, Input, Button, InputNumber } from "antd";
import styles from "./Roller.module.less";
import { postOnServer, authentifiedPostOnServer } from "server";
import { pattern, parse } from "./formula";
import UserContext from "components/form/UserContext";
import { addCampaign, addCharacter } from "features/user/reducer";
import { useDispatch } from "react-redux";
import TextResult from "./TextResult";
import { bbMessage } from "./Roll";

const Roller = ({
  loading,
  setLoading,
  setResult,
  setId,
  setBbMessage,
  ajaxError,
}) => {
  const dispatch = useDispatch();
  const updateUser = ({ campaign, character }) => {
    dispatch(addCampaign(campaign));
    dispatch(addCharacter(character));
  };

  return (
    <Form
      onFinish={({ formula, tn, ...values }) => {
        setLoading(true);
        setResult(undefined);

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
            success: ({ parameters, dice }) => {
              setResult(<TextResult parameters={parameters} dice={dice} />);
              setId(undefined);
              setBbMessage(undefined);
              setLoading(false);
            },
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
          }) => {
            setResult(<TextResult parameters={parameters} dice={dice} />);
            updateUser({ campaign, character });
            setId(id);
            setBbMessage(bbMessage({ description, total, parameters }));
            setLoading(false);
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
