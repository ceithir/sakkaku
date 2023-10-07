import React from "react";
import { Form, Select } from "antd";
import {
  distinctions,
  passions,
  adversities,
  anxieties,
} from "../data/advantages";

const format = (list, type) => {
  return [...list]
    .sort((a, b) => a.localeCompare(b))
    .map((name) => {
      return {
        label: `${type}: ${name}`,
        value: name,
      };
    });
};

const options = [
  ...format(distinctions, `Distinction`),
  ...format(passions, `Passion`),
  ...format(adversities, `Adversity`),
  ...format(anxieties, `Anxiety`),
];

const NamedModifiers = () => {
  return (
    <Form.Item label={`Advantages and Disadvantages`} name="namedModifiers">
      <Select
        options={options}
        optionFilterProp="label"
        allowClear={true}
        mode="multiple"
      />
    </Form.Item>
  );
};

export default NamedModifiers;
