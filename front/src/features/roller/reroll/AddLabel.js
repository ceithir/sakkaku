import React from "react";
import { Input, Form } from "antd";

const AddLabel = ({ onChange }) => {
  return (
    <Form>
      <Form.Item label={`Label`}>
        <Input
          placeholder={`Kolat Saboteur – Rank 2`}
          onChange={(e) => onChange(e.target.value.trim() || undefined)}
        />
      </Form.Item>
    </Form>
  );
};

export default AddLabel;
