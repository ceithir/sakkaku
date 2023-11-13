import React, { useEffect, useState } from "react";
import {
  Form,
  InputNumber,
  Divider,
  Select,
  Collapse,
  Checkbox,
  Button,
  Alert,
} from "antd";
import styles from "./Intent.module.less";
import NextButton from "./NextButton";
import { useSelector, useDispatch } from "react-redux";
import { addCampaign, addCharacter } from "../user/reducer";
import { selectAdvanced } from "../roller/reducer";
import classNames from "classnames";
import AbilityDescription from "./glitter/AbilityDescription";
import ABILITIES, { longname } from "./data/abilities";
import ExplainOptions from "./glitter/ExplainOptions";
import { Strife, Success, Explosion } from "../display/Symbol";
import { ControlOutlined } from "@ant-design/icons";
import UserContext from "components/form/UserContext";
import Advanced from "./form/Advanced";
import ApproachSelector from "./form/ApproachSelector";
import { useNavigate } from "react-router-dom";
import NamedModifiers from "./form/NamedModifiers";
import { distinctions, adversities } from "./data/advantages";

const AnimatedIntent = ({ onFinish, values }) => {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (completed) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [completed]);

  const onComplete = () => {
    setCompleted(true);
  };

  return <Intent onComplete={onComplete} onFinish={onFinish} values={values} />;
};

const Intent = ({ onFinish, values, onComplete }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [school, setSchool] = useState();
  const [skilledAssist, setSkilledAssist] = useState(0);
  const [unskilledAssist, setUnskilledAssist] = useState(0);
  const [commonModifiers, setCommonModifiers] = useState([]);
  const advanced = useSelector(selectAdvanced);
  let navigate = useNavigate();
  const [namedModifiers, setNamedModifiers] = useState([]);
  const [collapseActiveKey, setCollapseActiveKey] = useState();

  useEffect(() => {
    const distinctionsCount = namedModifiers.filter((name) =>
      distinctions.includes(name)
    ).length;
    const adversitiesCount = namedModifiers.filter((name) =>
      adversities.includes(name)
    ).length;

    const updatedModifiers = [
      ...(form.getFieldValue("common_modifiers") || []).filter((modifier) => {
        return modifier !== "distinction" && modifier !== "adversity";
      }),
      distinctionsCount > adversitiesCount && "distinction",
      adversitiesCount > distinctionsCount && "adversity",
    ].filter(Boolean);

    form.setFieldsValue({
      common_modifiers: updatedModifiers,
    });
    setCommonModifiers(updatedModifiers);
    if (distinctionsCount > 0 || adversitiesCount > 0) {
      setCollapseActiveKey(["modifiers"]);
    }
  }, [namedModifiers, form]);

  if (advanced) {
    return (
      <Advanced
        onFinish={onFinish}
        onComplete={onComplete}
        cancel={() => {
          navigate("/roll");
        }}
      />
    );
  }

  const wrappedOnFinish = (data) => {
    onComplete && onComplete();

    dispatch(addCampaign(data["campaign"]));
    dispatch(addCharacter(data["character"]));

    const {
      common_modifiers: commonModifiers = [],
      misc = [],
      unskilled_assist: unskilledAssist,
      skilled_assist: skilledAssist,
    } = data;
    const metadata = {};

    let { school } = data;
    if (school === "custom") {
      school = undefined;
    }

    if (data["approach"]) {
      metadata["approach"] = data["approach"];
    }

    if (!!data["namedModifiers"]?.length) {
      metadata["advantages"] = data["namedModifiers"];
    }

    const assist = [
      unskilledAssist &&
        `unskilledassist${unskilledAssist.toString().padStart(2, "0")}`,
      skilledAssist &&
        `skilledassist${skilledAssist.toString().padStart(2, "0")}`,
    ].filter(Boolean);

    onFinish({
      ...data,
      tn: Number.isInteger(data.tn) && data.tn > 0 ? data.tn : undefined,
      modifiers: [...commonModifiers, school, ...assist, ...misc].filter(
        Boolean
      ),
      metadata,
    });
  };

  const extraRingDice =
    (commonModifiers.includes("void") ? 1 : 0) + unskilledAssist;
  const extraSkillDice = (school === "wandering" ? 1 : 0) + skilledAssist;

  const commonModifiersOptions = [
    {
      value: "void",
      label: `Seize the Moment`,
      description: `A character may spend 1 Void point to roll one additional Ring die and subsequently keep one additional die. [Core, page 36]`,
    },
    {
      value: "distinction",
      label: `Distinction`,
      disabled: commonModifiers.includes("adversity"),
      description: `Each distinction has a [...] standardized mechanical effect, which applies in the circumstances described in the distinction’s entry and allows the character to reroll up to two dice. [Core, page 99]`,
    },
    {
      value: "adversity",
      label: `Adversity`,
      disabled: commonModifiers.includes("distinction"),
      description: (
        <>
          {`When an adversity applies to a task a character is trying to accomplish [...], the character’s player must choose and reroll two dice containing `}
          <Success />
          {` or `}
          <Explosion />
          {` symbols (if results with these symbols in the pool). After resolving the check, if the character failed, they gain 1 Void point. [Core, page 116]`}
        </>
      ),
    },
    {
      value: "compromised",
      label: `Compromised`,
      description: (
        <>
          {`When making a check, a Compromised character cannot keep dice containing `}
          <Strife />
          {` symbols (to a potential minimum of 0 kept dice). [Core, page 30]`}
        </>
      ),
    },
    {
      value: "offering",
      label: "Proper Offerings",
      description: `A shugenja who makes a material offering alongside an invocation may reroll up to 3 rolled dice showing blank results. [Core, page 189]`,
    },
  ];

  const miscOptions = [
    {
      value: "stirring",
      label: "Affected by — Shūji — Stirring the Embers",
      description: `Until the end of the scene, when [chosen Distinction advantage] applies to a check, the target [of Stirring the Embers] may reroll up to three dice (instead of two). [Core, page 219]`,
    },
  ];

  return (
    <Form
      className={styles.form}
      layout="vertical"
      initialValues={values}
      onFinish={wrappedOnFinish}
      scrollToFirstError
      form={form}
      onValuesChange={(changedValues) => {
        if (
          Object.keys(changedValues).some((name) => ["school"].includes(name))
        ) {
          setSchool(form.getFieldValue("school"));
        }
        if (
          Object.keys(changedValues).some((name) =>
            ["unskilled_assist"].includes(name)
          )
        ) {
          setUnskilledAssist(form.getFieldValue("unskilled_assist"));
        }
        if (
          Object.keys(changedValues).some((name) =>
            ["skilled_assist"].includes(name)
          )
        ) {
          setSkilledAssist(form.getFieldValue("skilled_assist"));
        }
        if (
          Object.keys(changedValues).some((name) =>
            ["common_modifiers"].includes(name)
          )
        ) {
          setCommonModifiers(form.getFieldValue("common_modifiers"));
        }
        if (
          Object.keys(changedValues).some((name) =>
            ["common_modifiers", "misc"].includes(name)
          )
        ) {
          form.validateFields(["misc"]);
        }
        if (
          Object.keys(changedValues).some((name) =>
            ["namedModifiers"].includes(name)
          )
        ) {
          setNamedModifiers(form.getFieldValue("namedModifiers"));
        }
      }}
    >
      <UserContext
        description={{
          placeholder: `Running at the foe! Fire, Fitness, Keen Balance`,
        }}
      />
      <fieldset>
        <Form.Item
          label="Ring"
          name="ring"
          rules={[
            { required: true, message: "Please enter your ring value" },
            {
              type: "integer",
              min: 1,
              max: 10,
              message: `Between 1 and 10 please.`,
            },
          ]}
          className={classNames({
            [styles.plus]: extraRingDice > 0,
            [styles[`plus-${extraRingDice.toString().padStart(2, "0")}`]]:
              extraRingDice > 0,
          })}
        >
          <InputNumber min={1} max={10} />
        </Form.Item>
        <Form.Item
          label="Skill"
          name="skill"
          rules={[
            {
              required: true,
              message: "Please enter your skill value (can be zero)",
            },
            {
              type: "integer",
              min: 0,
              max: 10,
              message: `Between 0 and 10 please.`,
            },
          ]}
          className={classNames({
            [styles.plus]: extraSkillDice > 0,
            [styles[`plus-${extraSkillDice.toString().padStart(2, "0")}`]]:
              extraSkillDice > 0,
          })}
        >
          <InputNumber min={0} max={10} />
        </Form.Item>
        <Form.Item label="TN" name="tn">
          <InputNumber min={1} />
        </Form.Item>
      </fieldset>
      <Divider />
      <ApproachSelector />
      <NamedModifiers />
      <Collapse
        ghost
        activeKey={collapseActiveKey}
        onChange={setCollapseActiveKey}
        items={[
          {
            label: "Common modifiers",
            key: "modifiers",
            children: (
              <>
                <Form.Item
                  name="common_modifiers"
                  className={styles.checkboxes}
                >
                  <Checkbox.Group options={commonModifiersOptions} />
                </Form.Item>
                <ExplainOptions options={commonModifiersOptions} />
              </>
            ),
          },
          {
            label: "Assistance",
            key: "assistance",
            children: (
              <>
                <fieldset className={styles["assist-container"]}>
                  <Form.Item
                    label="Assistance (unskilled)"
                    name="unskilled_assist"
                    initialValue={0}
                  >
                    <InputNumber min={0} max={10} />
                  </Form.Item>
                  <Form.Item
                    label="Assistance (skilled)"
                    name="skilled_assist"
                    initialValue={0}
                  >
                    <InputNumber min={0} max={10} />
                  </Form.Item>
                </fieldset>
                <ExplainOptions
                  description={`If a character making a check receives assistance from one or more others, the character making the check rolls one additional Skill die per [skilled assistant], and one additional Ring die per [unskilled assistant]. Then [...] a character making a check with assistance may keep up to 1 additional die per assisting character. [Core, page 26]`}
                  options={[
                    {
                      label: `Assistance (unskilled)`,
                      description: `Number of assisting characters who have 0 ranks in the skill in use.`,
                    },
                    {
                      label: `Assistance (skilled)`,
                      description: `Number of assisting characters who have 1 or more ranks of the skill in use.`,
                    },
                  ]}
                />
              </>
            ),
          },
          {
            label: "School abilities, techniques",
            key: "school",
            children: (
              <>
                <Form.Item label={`School Ability`} name="school">
                  <Select
                    showSearch
                    allowClear
                    options={[
                      ...Object.keys(ABILITIES)
                        .map((key) => {
                          return {
                            value: key,
                            label: longname(key),
                          };
                        })
                        .sort(({ label: a }, { label: b }) =>
                          a.localeCompare(b)
                        ),
                      {
                        value: "custom",
                        label: `Any other School — Any other School Ability`,
                      },
                    ]}
                    optionFilterProp="label"
                  />
                </Form.Item>
                {school &&
                  (school === "custom" ? (
                    <Alert
                      className={styles["custom-school"]}
                      type="info"
                      showIcon={true}
                      message={`Other Schools`}
                      description={
                        <>
                          <p>
                            {`Whether your School Ability allows you to reroll one or more dice (ex: Ikoma Shadow), alter (change the value) of one or more dice (ex: Kuni Purifier), add one or more kept dice set to a particular value (ex: Doji Diplomat), or any similar dice manipulation, you'll be able to apply it on the fly as the roll goes.`}
                          </p>
                          <p>{`For now, just roll without it, then, at the Keep step, click the “Do something else” button and select the appropriate option for you.`}</p>
                        </>
                      }
                    />
                  ) : (
                    <AbilityDescription
                      ability={school}
                      className={styles.school}
                    />
                  ))}
                <Form.Item
                  label={"Misc."}
                  name="misc"
                  rules={[
                    {
                      validator: async (_, misc) => {
                        if (
                          misc?.includes("stirring") &&
                          !form
                            .getFieldValue("common_modifiers")
                            ?.includes("distinction")
                        ) {
                          return Promise.reject(
                            new Error(
                              "Stirring the Embers has no effect on rolls not already affected by a Distinction."
                            )
                          );
                        }
                      },
                    },
                  ]}
                >
                  <Select
                    mode="multiple"
                    placeholder={"Extra options for unusual cases"}
                    options={miscOptions}
                    optionFilterProp="label"
                  />
                </Form.Item>
                <ExplainOptions options={miscOptions} />
              </>
            ),
          },
          {
            key: "advanced",
            label: "Advanced options",
            children: (
              <>
                <Form.Item className={styles["advanced-button"]}>
                  <Button
                    icon={<ControlOutlined />}
                    onClick={() => {
                      navigate("/roll-advanced");
                    }}
                  >{`Fully customized roll`}</Button>
                </Form.Item>
                <ExplainOptions
                  description={
                    <div className={styles["advanced-explanation"]}>
                      <p>{`For rolls that just follow their own rules, not much the default ones, and thus require a greater degree of customization. For example:`}</p>
                      <ul>
                        <li>{`Rolls modified with previously rolled dice, like Channeling [Core, page 190] or the Kata Striking as Air [Core, page 177].`}</li>
                        <li>{`Rolls without a ring value, like the Center stance of a duel [Core, page 260].`}</li>
                      </ul>
                      <p>{`This mode can also be used to recreate a previous roll result, then pick different dice. Can be useful if you misread a TN or forgot to trigger a disadvantage for example.`}</p>
                    </div>
                  }
                />
              </>
            ),
          },
        ]}
      />
      <Divider />
      <Form.Item>
        <NextButton htmlType="submit">{`Roll`}</NextButton>
      </Form.Item>
    </Form>
  );
};

export default AnimatedIntent;
