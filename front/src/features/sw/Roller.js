import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import styles from "./Roller.module.less";
import { Form, Button, InputNumber, Divider } from "antd";
import DefaultErrorMessage from "DefaultErrorMessage";
import { postOnServer, authentifiedPostOnServer } from "server";
import Result from "./Result";
import UserContext from "components/form/UserContext";
import {
  selectUser,
  addCampaign,
  addCharacter,
  setShowReconnectionModal,
} from "features/user/reducer";
import { useSelector, useDispatch } from "react-redux";
import CopyButtons from "components/aftermath/CopyButtons";
import { link, bbMessage } from "./Roll";
import { Link } from "react-router-dom";
import {
  AbilityDie,
  BoostDie,
  ChallengeDie,
  DifficutlyDie,
  ForceDie,
  ProficiencyDie,
  SetbackDie,
} from "./LabeledDie";

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

const Roller = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();
  const [context, setContext] = useState();

  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    if (!!result) {
      document.querySelector(":focus")?.blur();
    }
  }, [result]);

  if (error) {
    return <DefaultErrorMessage />;
  }

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
    setResult(undefined);
    setContext(undefined);

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

    const error = (err) => {
      if (err.message === "Authentication issue") {
        dispatch(setShowReconnectionModal(true));
      } else {
        setError(true);
      }
      setLoading(false);
    };

    if (!user || testMode) {
      postOnServer({
        uri: "/public/ffg/sw/rolls/create",
        body: {
          parameters,
          metadata,
        },
        success: (data) => {
          setResult(data);
          setLoading(false);
        },
        error,
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
      success: ({ roll, ...context }) => {
        setResult(roll);
        setContext(context);
        dispatch(addCampaign(campaign));
        dispatch(addCharacter(character));
        setLoading(false);
      },
      error,
    });
  };

  return (
    <Layout>
      <div className={styles.container}>
        <Form
          className={styles.form}
          onValuesChange={() => {
            setResult(undefined);
            setContext(undefined);
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
                    return Promise.reject(
                      new Error(`Must roll at least one die.`)
                    );
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
        {!!result && (
          <>
            <Divider />
            <Result {...result} />
            {!!context?.id && (
              <>
                <Divider />
                <div className={styles.buttons}>
                  <CopyButtons
                    link={link(context.id)}
                    bbMessage={bbMessage({
                      id: context.id,
                      description: context.description,
                      dice: result.dice,
                      parameters: result.parameters,
                      result: context.result,
                    })}
                  />
                  <Link to={`/ffg-sw-rolls/${context.id}`}>{`Go to page`}</Link>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Roller;
