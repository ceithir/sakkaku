import { useState } from "react";
import { Form, Input, Button, InputNumber, Divider, Typography } from "antd";
import styles from "./Roller.module.less";
import { parse } from "./formula";
import { postOnServer, authentifiedPostOnServer } from "server";
import UserContext from "components/form/UserContext";
import {
  selectUser,
  addCampaign,
  addCharacter,
  setShowReconnectionModal,
} from "features/user/reducer";
import { useSelector, useDispatch } from "react-redux";
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

export const Roller = ({
  loading,
  setLoading,
  setId,
  setResult,
  setBbMessage,
  setError,
}) => {
  const [parsedFormula, setParsedFormula] = useState();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  return (
    <Form
      onValuesChange={(_, { formula }) => {
        setParsedFormula(parse(formula));
        setResult(undefined);
      }}
      onFinish={({ formula, tn, ...values }) => {
        setLoading(true);
        setResult(undefined);

        const parameters = {
          ...parse(formula),
          tn,
        };
        const metadata = {
          original: formula,
        };

        const error = (err) => {
          if (err.message === "Authentication issue") {
            dispatch(setShowReconnectionModal(true));
          } else {
            setError(true);
          }
          setLoading(false);
        };

        const { testMode } = values;

        if (!user || testMode) {
          postOnServer({
            uri: "/public/dnd/rolls/create",
            body: {
              parameters,
              metadata,
            },
            success: (data) => {
              setResult(
                <Result parameters={data.parameters} dice={data.dice} />
              );
              setId(undefined);
              setBbMessage(undefined);
              setLoading(false);
            },
            error,
          });
          return;
        }

        const { campaign, character, description } = values;

        authentifiedPostOnServer({
          uri: "/dnd/rolls/create",
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
            description,
            result: { total },
          }) => {
            setResult(<Result parameters={parameters} dice={dice} />);
            setId(id);
            setBbMessage(bbMessage({ parameters, description, total }));
            dispatch(addCampaign(campaign));
            dispatch(addCharacter(character));
            setLoading(false);
          },
          error,
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
