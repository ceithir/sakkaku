import React, { useState } from "react";
import { Form, InputNumber, Typography, Button, Alert } from "antd";
import styles from "./Advanced.module.less";
import { useSelector, useDispatch } from "react-redux";
import { addCampaign, addCharacter } from "features/user/reducer";
import UserContext from "components/form/UserContext";
import DynamicDiceSelector from "./DynamicDiceSelector";
import Dice from "../Dice";
import { selectLoading } from "../reducer";

const { Paragraph, Title } = Typography;

const defaultRules = [
  { required: true, message: "Please enter a value (can be zero)." },
  {
    type: "integer",
    min: 0,
    max: 10,
    message: `Between 1 and 10 please.`,
  },
];

const buildDiceList = ({ ring, skill, channeled }) => {
  let list = [];
  for (let i = 0; i < ring; i++) {
    list.push({
      dice: {
        type: "ring",
        value: {},
      },
      className: styles["undefined-ring-die"],
    });
  }
  channeled
    .filter(({ type }) => type === "ring")
    .forEach((dice) => {
      list.push({ dice });
    });
  for (let i = 0; i < skill; i++) {
    list.push({
      dice: { type: "skill", value: {} },
      className: styles["undefined-skill-die"],
    });
  }
  channeled
    .filter(({ type }) => type === "skill")
    .forEach((dice) => {
      list.push({ dice });
    });

  return list;
};

const Advanced = ({ onFinish, onComplete, cancel }) => {
  const loading = useSelector(selectLoading);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [ring, setRing] = useState();
  const [skill, setSkill] = useState();
  const [channeled, setChanneled] = useState([]);

  const wrappedOnFinish = (data) => {
    onComplete && onComplete();

    dispatch(addCampaign(data["campaign"]));
    dispatch(addCharacter(data["character"]));

    const { ring, skill, channeled = [] } = data;

    onFinish({
      ...data,
      tn: Number.isInteger(data.tn) && data.tn > 0 ? data.tn : undefined,
      ring: ring + channeled.filter(({ type }) => type === "ring").length,
      skill: skill + channeled.filter(({ type }) => type === "skill").length,
      modifiers: ["unrestricted"],
    });
  };

  const diceList = buildDiceList({ ring, skill, channeled });

  return (
    <Form
      className={styles.form}
      onFinish={wrappedOnFinish}
      scrollToFirstError
      form={form}
      onValuesChange={(changedValues) => {
        if (
          Object.keys(changedValues).some((name) => ["ring"].includes(name))
        ) {
          setRing(form.getFieldValue("ring"));
        }
        if (
          Object.keys(changedValues).some((name) => ["skill"].includes(name))
        ) {
          setSkill(form.getFieldValue("skill"));
        }
        if (
          Object.keys(changedValues).some((name) =>
            ["channeled"].includes(name)
          )
        ) {
          setChanneled(form.getFieldValue("channeled"));
        }
      }}
    >
      <Alert
        message={`With great powers…`}
        description={
          <>
            <p>{`In this mode, the roller will grant you full control. You can roll anything, reroll anything, change any result to any other result, keep everything or nothing…`}</p>
            <p>{`However, this also means you'll have to handle each step of the roll "by hand", without guidance and safeguard.`}</p>
            <p>{`So, for the sake of your GM's sanity, please double-check the rules before proceeding.`}</p>
          </>
        }
        type="warning"
        showIcon
        closable
        className={styles.warning}
      />
      <Title level={2}>{`Fully customized roll`}</Title>
      <UserContext
        description={{
          placeholder: `Bind the Shadow, Theology (Earth), using two channeled dice from previous round`,
        }}
      />
      <Form.Item label={`TN`} name="tn">
        <InputNumber min={1} />
      </Form.Item>

      <fieldset>
        <legend>{`Rolled Dice`}</legend>
        <Form.Item
          label={`Enter here the number of ring dice that'll actually be rolled`}
          name="ring"
          rules={defaultRules}
        >
          <InputNumber min={0} max={10} />
        </Form.Item>
        <Form.Item
          label={`Enter here the number of skill dice that'll actually be rolled`}
          name="skill"
          rules={defaultRules}
        >
          <InputNumber min={0} max={10} />
        </Form.Item>
      </fieldset>

      <fieldset>
        <legend>{`Set Dice`}</legend>
        <div>
          <p>
            {`You may also/instead add to your pool dice already set to a certain value. They'll be treated as rolled dice for the purpose of further mechanics, but won't really be rolled.`}
          </p>
          <p>
            {`See "Add a Rolled Die", page 27 of the Core rulebook, for the base rule, and Choosing to Channel/Using Channeled Dice, page 190 of the same book, for a practical example.`}
          </p>
          <p>
            {`Note that, by itself, the replacement effect from the Center action in a duel happens after rolling dice normally (it does not modify your normal dice pool).`}
          </p>
        </div>
        <Form.List name="channeled">
          {(fields, { add, remove }, { errors }) => {
            return (
              <DynamicDiceSelector
                fields={fields}
                defaultValue={{ type: "skill", value: { success: 1 } }}
                errors={errors}
                buttonText={`Add a die set to a specific value`}
                add={add}
                remove={remove}
                className={styles.channeled}
              />
            );
          }}
        </Form.List>
      </fieldset>

      <fieldset>
        <legend>{`Full dice pool – Preview`}</legend>
        {diceList.length > 0 ? (
          <div className={styles["dice-list"]}>
            {diceList.map(({ dice, className }, index) => {
              return (
                <span key={index.toString()} className={className}>
                  <Dice dice={dice} />
                </span>
              );
            })}
          </div>
        ) : (
          <Paragraph type="danger">{`You aren't rolling a single die at the moment.`}</Paragraph>
        )}
      </fieldset>

      <div className={styles.buttons}>
        <Button onClick={cancel}>{`Cancel`}</Button>
        <Button
          type="primary"
          htmlType="submit"
          disabled={diceList.length === 0}
          loading={loading}
        >
          {`Roll`}
        </Button>
      </div>
    </Form>
  );
};

export default Advanced;
