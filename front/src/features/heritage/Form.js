import React from "react";
import { Button, Form, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { selectLoading, selectError, create } from "./reducer";
import DefaultErrorMessage from "../../DefaultErrorMessage";
import styles from "./Form.module.less";
import TABLES from "./data/heritage";
import { addCampaign, addCharacter, selectUser } from "../user/reducer";
import UserContext from "components/form/UserContext";

const CustomForm = () => {
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const dispatch = useDispatch();

  const user = useSelector(selectUser);

  if (error) {
    return <DefaultErrorMessage />;
  }

  return (
    <Form
      initialValues={{ table: "core" }}
      onFinish={(data) => {
        const { campaign, character, description, table, testMode } = data;

        dispatch(
          create({
            metadata: { table },
            context: { campaign, character, description },
            user: !testMode && user,
          })
        );

        dispatch(addCampaign(campaign));
        dispatch(addCharacter(character));
      }}
      className={styles.form}
      layout="vertical"
    >
      <UserContext
        description={{
          placeholder: `Using Celestial Realms Table to emphasize my character's mother was born Phoenix.`,
          rules: [],
        }}
      />
      <Form.Item name="table" label="Book" rules={[{ required: true }]}>
        <Select
          options={Object.keys(TABLES).map((value) => {
            return { value, label: TABLES[value]["name"] };
          })}
        />
      </Form.Item>
      <Form.Item className={styles.footer}>
        <Button type="primary" htmlType="submit" loading={loading}>
          {`Roll`}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CustomForm;
