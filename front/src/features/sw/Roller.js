import styles from "./Roller.module.less";
import { Form, Button, InputNumber } from "antd";
import { postOnServer, authentifiedPostOnServer } from "server";
import Result from "./Result";
import UserContext from "components/form/UserContext";
import { selectUser } from "features/user/reducer";
import { useSelector } from "react-redux";
import {
  AbilityDie,
  BoostDie,
  ChallengeDie,
  DifficutlyDie,
  ForceDie,
  ProficiencyDie,
  SetbackDie,
} from "./LabeledDie";
import { bbMessage } from "./Roll";

const DiceNumber = ({ label, name, rules = [] }) => {
  return (
    <Form.Item
      label={label}
      name={name}
      rules={[
        {
          type: "integer",
          min: 0,
          max: 10,
          message: `Between 0 and 10 please.`,
        },
        ...rules,
      ]}
    >
      <InputNumber min="0" max="10" />
    </Form.Item>
  );
};

const Roller = ({
  loading,
  setLoading,
  updateResult,
  clearResult,
  ajaxError,
}) => {
  const user = useSelector(selectUser);

  const onFinish = ({
    boost,
    ability,
    proficiency,
    setback,
    difficulty,
    challenge,
    force,

    testMode,
    campaign,
    character,
    description,
  }) => {
    setLoading(true);
    clearResult();

    const parameters = {
      boost,
      ability,
      proficiency,
      setback,
      difficulty,
      challenge,
      force,
    };
    const metadata = {};

    if (!user || testMode) {
      postOnServer({
        uri: "/public/ffg/sw/rolls/create",
        body: {
          parameters,
          metadata,
        },
        success: (data) => updateResult({ content: <Result {...data} /> }),
        error: ajaxError,
      });
      return;
    }

    authentifiedPostOnServer({
      uri: "/ffg/sw/rolls/create",
      body: {
        parameters,
        metadata,
        campaign,
        character,
        description,
      },
      success: ({ roll, id, description, result }) => {
        const { dice, parameters } = roll;
        updateResult({
          content: <Result {...roll} />,
          id,
          bbMessage: bbMessage({ id, description, dice, parameters, result }),
          campaign,
          character,
        });
      },
      error: ajaxError,
    });
  };

  return (
    <Form
      className={styles.form}
      onValuesChange={() => {
        clearResult();
      }}
      onFinish={onFinish}
    >
      <UserContext />
      <div className={styles.line}>
        <DiceNumber label={<BoostDie />} name="boost" />
        <DiceNumber label={<AbilityDie />} name="ability" />
        <DiceNumber label={<ProficiencyDie />} name="proficiency" />
      </div>
      <div className={styles.line}>
        <DiceNumber label={<SetbackDie />} name="setback" />
        <DiceNumber label={<DifficutlyDie />} name="difficulty" />
        <DiceNumber label={<ChallengeDie />} name="challenge" />
      </div>
      <div className={styles.center}>
        <DiceNumber
          label={<ForceDie />}
          name="force"
          rules={[
            ({ getFieldValue }) => ({
              validator: () => {
                if (
                  !!getFieldValue("boost") ||
                  !!getFieldValue("ability") ||
                  !!getFieldValue("proficiency") ||
                  !!getFieldValue("setback") ||
                  !!getFieldValue("difficulty") ||
                  !!getFieldValue("challenge") ||
                  !!getFieldValue("force")
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(`Must roll at least one die.`));
              },
            }),
          ]}
        />
      </div>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {`Roll`}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Roller;
