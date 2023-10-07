import React, { useState, useEffect } from "react";
import { Form, Input, Button, InputNumber, Divider, Spin } from "antd";
import DefaultErrorMessage from "DefaultErrorMessage";
import Layout from "./Layout";
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
import Result, { ResultPlaceholder } from "./FormResult";
import ExternalLink from "features/navigation/ExternalLink";

const Syntax = () => {
  return (
    <div className={styles.syntax}>
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
    </div>
  );
};

export const Roller = () => {
  const [formula, setFormula] = useState();
  const [parsedFormula, setParsedFormula] = useState();
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

  const placeholderMessage = () => {
    if (!formula) {
      return `Awaiting formula…`;
    }
    if (!parsedFormula) {
      return `Incomplete or erroneous formula…`;
    }
    return `✓`;
  };

  return (
    <div className={styles.container}>
      <Form
        onValuesChange={(_, { formula }) => {
          setFormula(formula);
          setParsedFormula(parse(formula));
          setResult(undefined);
          setContext(undefined);
        }}
        onFinish={({ formula, tn, ...values }) => {
          setLoading(true);
          setResult(undefined);
          setContext(undefined);

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
                setResult(data);
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
            success: ({ roll, ...context }) => {
              setResult(roll);
              setContext(context);
              dispatch(addCampaign(campaign));
              dispatch(addCharacter(character));
              setLoading(false);
            },
            error,
          });
        }}
        className={styles.form}
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
      <Divider />
      {result && <Result result={result} context={context} />}
      {!result && (
        <ResultPlaceholder
          text={
            <>
              {loading && <Spin />}
              {!loading && (
                <>
                  {placeholderMessage()}
                  <Syntax />
                </>
              )}
            </>
          }
        />
      )}
    </div>
  );
};

const RollerWrapper = () => {
  return (
    <Layout>
      <Roller />
    </Layout>
  );
};

export default RollerWrapper;
