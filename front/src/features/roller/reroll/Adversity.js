import React, { useState } from "react";
import NextButton from "../NextButton";
import { bestDiceToReroll } from "../utils";
import RerollDiceBox from "./RerollDiceBox";

const Adversity = ({ dices, onFinish, modifiers }) => {
  const defaultToReroll = bestDiceToReroll({
    roll: { dices, modifiers },
    max: 2,
    restrictFunc: ({ value: { success = 0, explosion = 0 } }) =>
      success > 0 || explosion > 0,
  });
  const [toReroll, setToReroll] = useState(defaultToReroll);
  const successDices = dices.filter(
    ({ value }) => value.success || value.explosion
  );
  const max = 2;
  const min = Math.min(max, successDices.length);
  const toggle = (index) => {
    if (toReroll.includes(index)) {
      return setToReroll(toReroll.filter((i) => i !== index));
    }
    return setToReroll([...toReroll, index]);
  };
  const text = `Due to your Adversity, you must select two success dice (or as much as possible if you don't have two) that will be rerolled.`;

  return (
    <RerollDiceBox
      title={"Adversity"}
      text={text}
      dices={dices.map((dice, index) => {
        const selected = toReroll.includes(index);
        const isSuccess = dice.value.success || dice.value.explosion;
        const selectable = isSuccess && (selected || toReroll.length < max);
        return {
          ...dice,
          selectable,
          selected,
          disabled: !selectable,
          toggle: () => toggle(index),
        };
      })}
      footer={
        <NextButton
          disabled={toReroll.length < min}
          onClick={() => onFinish(toReroll)}
        >
          {"Continue"}
        </NextButton>
      }
    />
  );
};

export default Adversity;
