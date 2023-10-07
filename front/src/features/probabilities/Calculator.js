import React, { useState, useEffect } from "react";
import { Form, InputNumber, Typography, Switch, Divider } from "antd";
import styles from "./Calculator.module.less";
import worker from "workerize-loader!./worker"; // eslint-disable-line import/no-webpack-loader-syntax
import { LoadingOutlined } from "@ant-design/icons";
import useInterval from "useInterval";
import Title from "../display/Title";
import pregenerated from "./data/cached";
import ExternalLink from "features/navigation/ExternalLink";

const { Paragraph, Text } = Typography;

let workerInstance;
let cache = {};
const keify = (mathParams) => JSON.stringify(mathParams);
const load = (params) => cache[keify(params)];
const save = (params, result) => {
  cache[keify(params)] = result;
};
const exists = (params) => !!load(params);

const validParameters = ({
  tn,
  ring,
  skill,
  skilled_assist,
  unskilled_assist,
  opp,
}) => {
  return (
    [tn, ring, skill, skilled_assist, unskilled_assist, opp].every(
      (n) => Number.isInteger(n) && n >= 0 && n <= 10
    ) &&
    tn >= 1 &&
    ring >= 1
  );
};

const getFromPregenerated = (params) => {
  // Skilled assistance is not supported
  if (params.options.keptDiceCount !== params.ring) {
    return undefined;
  }

  const { tn, ring, skill, opp } = params;
  const compromised = params.options.compromised ? 1 : 0;
  return pregenerated[[ring, skill, tn, compromised, opp].join("|")];
};

const TextOutput = ({
  ring,
  skill,
  tn,
  unskilled_assist,
  skilled_assist,
  compromised,
  opp,
}) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState();

  useEffect(() => {
    workerInstance = worker();
    workerInstance.addEventListener("message", (message) => {
      const {
        data: { type, params, result },
      } = message;
      if (type === "custom") {
        const formattedResult = `${(Math.abs(result) * 100).toFixed(2)}%`;
        save(params, formattedResult);
      }
    });
    return () => {
      workerInstance.terminate();
    };
  }, []);

  useEffect(() => {
    if (
      !validParameters({
        ring,
        skill,
        tn,
        unskilled_assist,
        skilled_assist,
        opp,
      })
    ) {
      return;
    }

    const mathParams = {
      tn,
      ring: ring + unskilled_assist,
      skill: skill + skilled_assist,
      options: {
        compromised,
        keptDiceCount: ring + unskilled_assist + skilled_assist,
      },
      opp,
    };
    if (exists(mathParams)) {
      return;
    }

    const pregen = getFromPregenerated(mathParams);
    if (pregen) {
      save(mathParams, pregen + "%");
      return;
    }

    workerInstance.asyncChances(mathParams);
  }, [ring, skill, tn, unskilled_assist, skilled_assist, compromised, opp]);

  useInterval(() => {
    const mathParams = {
      tn,
      ring: ring + unskilled_assist,
      skill: skill + skilled_assist,
      options: {
        compromised,
        keptDiceCount: ring + unskilled_assist + skilled_assist,
      },
      opp,
    };

    if (exists(mathParams)) {
      setResult(load(mathParams));
      setLoading(false);
      return;
    }

    setLoading(true);
  }, 200);

  return (
    <StaticTextOutput
      loading={loading}
      result={result}
      compromised={compromised}
      opp={opp}
      tn={tn}
    />
  );
};

const StaticTextOutput = ({ result, loading, compromised, tn, opp }) => {
  const text = () => {
    if (opp > 0) {
      const oppAsText = opp > 1 ? `${opp} opportunities` : `${opp} opportunity`;

      return compromised
        ? `Chances to have at least ${tn} success and at least ${oppAsText} without taking strife: `
        : `Chances to have at least ${tn} success and at least ${oppAsText}, taking as much strife as necessary: `;
    }

    return compromised
      ? `Chances to have at least ${tn} success without taking strife: `
      : `Chances to have at least ${tn} success, taking as much strife as necessary: `;
  };

  return (
    <>
      <Paragraph>
        <Text>{text()}</Text>
        <Text strong>{loading ? <LoadingOutlined /> : result}</Text>
        <Text>{`.`}</Text>
      </Paragraph>
      <Paragraph>
        {`All results ignore rerolls, alterations, and other modifiers.`}
      </Paragraph>
    </>
  );
};

const Calculator = () => {
  const [form] = Form.useForm();
  const initialValues = {
    ring: 3,
    skill: 1,
    tn: 3,
    unskilled_assist: 0,
    skilled_assist: 0,
    compromised: false,
    opp: 0,
  };
  const [values, setValues] = useState(initialValues);

  return (
    <div className={styles.layout}>
      <Title>{`Legend of the Five Rings (FFG) – Probabilities`}</Title>
      <Form
        layout={"inline"}
        form={form}
        initialValues={initialValues}
        onValuesChange={(_, values) => {
          setValues(values);
        }}
        className={styles.form}
      >
        <Form.Item label="Ring" name="ring">
          <InputNumber min={1} max={10} />
        </Form.Item>
        <Form.Item label="Skill" name="skill">
          <InputNumber min={0} max={10} />
        </Form.Item>
        <Form.Item label="TN" name="tn">
          <InputNumber min={1} max={10} />
        </Form.Item>
        <Divider />
        <Form.Item
          label={"Compromised?"}
          name="compromised"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item label="Opportunities" name="opp">
          <InputNumber min={0} max={10} />
        </Form.Item>
        <Divider />
        <Form.Item label="Assistance (unskilled)" name="unskilled_assist">
          <InputNumber min={0} max={10} />
        </Form.Item>
        <Form.Item label="Assistance (skilled)" name="skilled_assist">
          <InputNumber min={0} max={10} />
        </Form.Item>
        <Divider />
        <output>
          <TextOutput {...values} />
        </output>
        <Divider />
        <p>
          {`Some results compiled `}
          <ExternalLink
            href={`https://raw.githubusercontent.com/ceithir/l5r-ffg-probabilities/main/probabilities.csv`}
          >{`as a (CSV) spreadsheet`}</ExternalLink>
        </p>
      </Form>
    </div>
  );
};

export default Calculator;
