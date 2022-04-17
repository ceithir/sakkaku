import React, { useState, useEffect } from "react";
import { Form, Input, Typography, Button, InputNumber, Divider } from "antd";
import DefaultErrorMessage from "DefaultErrorMessage";
import Layout from "./Layout";
import styles from "./Roller.module.less";
import { parse } from "./formula";
import { postOnServer, authentifiedPostOnServer } from "server";
import UserContext from "components/form/UserContext";
import { selectUser, addCampaign, addCharacter } from "features/user/reducer";
import { useSelector, useDispatch } from "react-redux";
import Result, { ResultPlaceholder } from "./FormResult";

const { Paragraph } = Typography;

const Roller = () => {
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

  return (
    <Layout>
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

            const error = (_err) => {
              setError(true);
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
          {formula && !parsedFormula && (
            <Paragraph type="secondary">{`Incomplete or erroneous formula…`}</Paragraph>
          )}
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
        {!result && <ResultPlaceholder />}
      </div>
    </Layout>
  );
};

export default Roller;
