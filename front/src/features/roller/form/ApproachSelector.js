import React from "react";
import { Form, Select } from "antd";
import { rings, skills } from "../data/approaches";

const options = rings
  .map((ring) =>
    skills.map(({ name: skill }) => {
      const value = `${ring}|${skill}`;
      const label = `${skill} (${ring})`;

      return { value, label };
    })
  )
  .flat(1)
  .sort(({ label: a }, { label: b }) => a.localeCompare(b));

const ApproachSelector = () => {
  return (
    <Form.Item label={`Approach`} name="approach">
      <Select
        options={options}
        showSearch={true}
        optionFilterProp="label"
        allowClear={true}
      />
    </Form.Item>
  );
};

export default ApproachSelector;
