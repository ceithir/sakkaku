import styles from "./Roller.module.less";
import { Form, Button, InputNumber } from "antd";
import Result from "./Result";
import UserContext from "components/form/UserContext";
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
import ExternalLink from "features/navigation/ExternalLink";

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

const Roller = ({ loading, setLoading, clearResult, createRoll }) => {
  const onFinish = ({
    boost,
    ability,
    proficiency,
    setback,
    difficulty,
    challenge,
    force,

    ...userData
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

    createRoll({
      uri: "/ffg/sw/rolls/create",
      parameters,
      metadata,
      userData,
      result: (data) => {
        if (!data.id) {
          return { content: <Result {...data} /> };
        }

        const { roll, id, description, result } = data;
        const { dice, parameters } = roll;
        return {
          content: <Result {...roll} />,
          bbMessage: bbMessage({ id, description, dice, parameters, result }),
        };
      },
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
      <ExternalLink href="https://ttftcuts.github.io/sw_dice/">{`Tell me the odds.`}</ExternalLink>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {`Roll`}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Roller;
