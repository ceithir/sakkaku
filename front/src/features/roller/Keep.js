import React, { useState } from "react";
import NextButton from "./NextButton";
import Result from "./Result";
import { Typography, Form, Button, Divider } from "antd";
import ExplosionDices from "./ExplosionDices";
import styles from "./Keep.module.less";
import { useSelector, useDispatch } from "react-redux";
import { selectToKeep, setToKeep } from "./reducer";
import DynamicDiceSelector from "./form/DynamicDiceSelector";
import { FACETS } from "./SelectDieSide";
import { rolledDicesCount, keptDicesCount } from "./utils";
import ExplainOptions from "./glitter/ExplainOptions";

const { Paragraph } = Typography;

const AddKeptDiceForm = ({ dices, onChange, compromised }) => {
  return (
    <Form
      onValuesChange={(_, allValues) => {
        onChange(allValues["dices"]);
      }}
      initialValues={{ dices }}
    >
      <Form.List name="dices">
        {(fields, { add, remove }, { errors }) => {
          return (
            <DynamicDiceSelector
              fields={fields}
              defaultValue={{ type: "ring", value: { opportunity: 1 } }}
              errors={errors}
              buttonText={"Add a kept die"}
              add={add}
              remove={remove}
              values={dices}
              facets={
                compromised
                  ? FACETS.map((facet) => {
                      if (facet.value.strife > 0) {
                        return { ...facet, disabled: true };
                      }
                      return facet;
                    })
                  : FACETS
              }
            />
          );
        }}
      </Form.List>
    </Form>
  );
};

const Keep = ({
  dices,
  ring,
  skill,
  onFinish,
  tn,
  rerollTypes,
  addkept,
  setAddKept,
  modifiers,
  addReroll,
  addAlteration,
  channel,
}) => {
  const toKeep = useSelector(selectToKeep);
  const dispatch = useDispatch();
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(
    !!addkept?.length
  );

  const bypassCheck = modifiers.includes("unrestricted");

  const compromised = modifiers.includes("compromised");

  const max = keptDicesCount({ ring, modifiers });
  const basePool = rolledDicesCount({ ring, skill, modifiers });

  const keepingExplosions = dices.some((dice) => dice.status === "kept");

  const trulyCompromised =
    compromised &&
    dices
      .filter((dice) => dice.status === "pending")
      .every((dice) => dice.value.strife);

  const showAddKept = addkept?.length && !keepingExplosions;

  const toggle = (index) => {
    if (toKeep.includes(index)) {
      return dispatch(setToKeep(toKeep.filter((i) => i !== index)));
    }
    return dispatch(setToKeep([...toKeep, index]));
  };

  const text = () => {
    if (keepingExplosions) {
      return "Select which explosions you wish to keep (if any).";
    }

    if (trulyCompromised) {
      return "Being compromised, you cannot keep any die with strife… Which, in this very specific case, means you cannot keep any die at all.";
    }

    if (bypassCheck) {
      return `Select the dice you want/have to keep.`;
    }

    let defaultText =
      max > 1
        ? `You can keep up to ${max} dice (min 1)`
        : "You must choose one die to keep";

    if (addkept?.length) {
      defaultText += " in top of your added dice";
    }

    defaultText += ".";

    if (compromised) {
      return `${defaultText} However, due to being compromised, you cannot keep any die with strife.`;
    }

    return defaultText;
  };

  const buttonText = () => {
    if (trulyCompromised) {
      return "Continue";
    }

    if (keepingExplosions) {
      if (toKeep.length === 0) {
        return "Don't keep anything else";
      }

      if (toKeep.length === 1) {
        return "Also keep that die";
      }

      return "Also keep these dice";
    }

    if (toKeep.length === 1) {
      return "Keep that die";
    }

    if (toKeep.length === 0) {
      if (bypassCheck) {
        return `Don't keep anything`;
      }

      return "Must select at least one die";
    }

    return "Keep these dice";
  };

  const wrapDices = () => {
    const baseDices = dices.map((dice, index) => {
      const { status, value } = dice;
      const selected = status === "kept" || toKeep.includes(index);
      const available = status === "pending" && (!compromised || !value.strife);
      const selectable =
        bypassCheck ||
        (available && (selected || keepingExplosions || max > toKeep.length));
      const disabled = (() => {
        if (status === "kept") {
          return false;
        }
        if (status !== "pending") {
          return true;
        }
        return !selectable;
      })();
      return {
        ...dice,
        selectable,
        selected,
        disabled,
        toggle: () => toggle(index),
        className: dice.metadata?.source === "addkept" && styles["addkept-die"],
      };
    });

    if (showAddKept) {
      return [
        ...baseDices,
        ...addkept.map((dice) => {
          return {
            ...dice,
            status: "pending",
            metadata: { source: "addkept" },
            selected: true,
            selectable: false,
            className: styles["addkept-die"],
          };
        }),
      ];
    }

    return baseDices;
  };
  const resultDices = () => {
    if (showAddKept) {
      return [
        ...dices,
        ...addkept.map((dice) => {
          return {
            ...dice,
            status: "kept",
          };
        }),
      ];
    }

    return dices;
  };

  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <ExplosionDices
          dices={wrapDices()}
          basePool={basePool}
          rerollTypes={rerollTypes}
        />
        <Paragraph className={styles.text}>{text()}</Paragraph>
        <Result
          dices={resultDices()}
          tn={tn}
          extra={toKeep}
          className={styles.figures}
          modifiers={rerollTypes}
        />
      </div>
      <div className={styles["main-buttons"]}>
        {!keepingExplosions && (
          <Button
            className={styles["else-button"]}
            onClick={() => setShowAdvancedOptions(true)}
            disabled={showAdvancedOptions}
          >{`Do something else`}</Button>
        )}
        <NextButton
          onClick={() => {
            if (!keepingExplosions && addkept?.length) {
              onFinish(toKeep, addkept);
              return;
            }

            onFinish(toKeep);
          }}
          disabled={
            !(keepingExplosions || trulyCompromised || bypassCheck) &&
            toKeep.length === 0
          }
        >
          {buttonText()}
        </NextButton>
      </div>

      {!keepingExplosions && showAdvancedOptions && (
        <>
          <Divider />
          <div className={styles["additional-actions"]}>
            <AddKeptDiceForm
              dices={addkept}
              onChange={setAddKept}
              compromised={compromised}
            />
            <div className={styles.buttons}>
              <Button disabled={!addReroll} onClick={addReroll}>
                {`Reroll some dice`}
              </Button>
              <Button disabled={!addAlteration} onClick={addAlteration}>
                {`Alter some dice`}
              </Button>
              <Button onClick={channel}>{`Reserve some dice`}</Button>
            </div>
            <ExplainOptions
              options={[
                {
                  label: `Add a kept die`,
                  description: `Add a kept die to your check result, set to a defined value. It will be kept in addition to your normal maximum, and can explode normally. Examples: Yari of Air Invocation [Core, page 196], Void Downtime Opportunity [Core, page 329].`,
                },
                {
                  label: `Reroll some dice`,
                  description: `Reroll one or more dice. Can be used to apply an Adversity you forgot to declare beforehand, or for any other reroll really. One example among many: The Rival Bond Ability [Paths of Wave, page 191].`,
                },
                {
                  label: `Alter some dice`,
                  description: `Set one or more dice to a different side, or substitute them with different dice altogether. Examples: The Yoriki Title Ability [Emerald Empire, page 253], the aftermath of a Duel Center Action.`,
                },
                {
                  label: `Reserve some dice`,
                  description: `Select one or more dice to reserve for a later roll. The chosen dice will be "frozen" in their current state and the roll will end there. Useful to save dice for later, like with Channeling [Core, page 190], the Kata Striking as Air [Core, page 177], or the Duel Center Action [Core, page 260].`,
                },
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Keep;
