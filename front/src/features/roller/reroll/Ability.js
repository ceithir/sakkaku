import React, { useState } from "react";
import NextButton from "../NextButton";
import { Button } from "antd";
import styles from "./Ability.module.less";
import RerollDiceBox from "./RerollDiceBox";
import { bestDiceToReroll } from "../utils";
import AddLabel from "./AddLabel";

const Ability = ({
  dices,
  onFinish,
  text,
  basePool,
  rerollTypes,
  title,
  cancel,
  modifiers,
  showLabelInput,
}) => {
  const defaultToReroll = bestDiceToReroll({
    roll: { dices, modifiers },
    max: 1,
  });
  const [toReroll, setToReroll] = useState(defaultToReroll);
  const [label, setLabel] = useState();

  const toggle = (index) => {
    if (toReroll.includes(index)) {
      return setToReroll(toReroll.filter((i) => i !== index));
    }
    return setToReroll([...toReroll, index]);
  };

  const buttonText = () => {
    if (toReroll.length === 0) {
      return "Continue";
    }

    if (toReroll.length === 1) {
      return "Reroll that die";
    }

    return "Reroll these dice";
  };

  return (
    <RerollDiceBox
      title={title}
      text={text}
      dices={dices.map((dice, index) => {
        const selected = toReroll.includes(index);
        return {
          ...dice,
          selectable: true,
          selected,
          disabled: false,
          toggle: () => toggle(index),
        };
      })}
      basePool={basePool}
      rerollTypes={rerollTypes}
      content={showLabelInput ? <AddLabel onChange={setLabel} /> : <></>}
      footer={
        <div className={styles.buttons}>
          {cancel && <Button onClick={cancel}>{`Cancel`}</Button>}
          <NextButton
            onClick={() => onFinish(toReroll, label)}
            disabled={cancel && toReroll.length === 0}
          >
            {buttonText()}
          </NextButton>
        </div>
      }
    />
  );
};

export default Ability;
