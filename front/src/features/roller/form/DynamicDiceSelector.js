import React from "react";
import { Form, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SelectDieSide from "../SelectDieSide";
import classNames from "classnames";
import styles from "./DynamicDiceSelector.module.less";

const DynamicDiceSelector = ({
  fields,
  labelText,
  defaultValue,
  buttonText,
  errors,
  add,
  remove,
  values = [],
  facets,
  className,
  buttonPosition = "top",
}) => {
  const AddButton = () => {
    return (
      <Form.Item>
        <Button
          type="dashed"
          onClick={() => add(defaultValue)}
          icon={<PlusOutlined />}
        >
          {buttonText}
        </Button>
        <Form.ErrorList errors={errors} />
      </Form.Item>
    );
  };

  return (
    <div className={classNames(styles.container, className)}>
      {buttonPosition !== "bottom" && <AddButton />}
      <div className={styles.selects}>
        {fields.map((field, index) => (
          <Form.Item required={false} key={field.key} label={labelText}>
            <Form.Item {...field} noStyle>
              <SelectDieSide
                initialValue={values[index] || defaultValue}
                facets={facets}
                allowClear={!!remove}
                onClear={() => remove(field.name)}
              />
            </Form.Item>
          </Form.Item>
        ))}
      </div>
      {buttonPosition === "bottom" && <AddButton />}
    </div>
  );
};

export default DynamicDiceSelector;
