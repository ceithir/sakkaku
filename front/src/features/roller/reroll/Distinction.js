import React, { useState } from "react";
import NextButton from "../NextButton";
import { bestDiceToReroll } from "../utils";
import RerollDiceBox from "./RerollDiceBox";

const Distinction = ({ dices, onFinish, modifiers }) => {
  const max = modifiers.includes("stirring") ? 3 : 2;
  const bypassMax =
    modifiers.includes("deathdealer") || modifiers.includes("manipulator");

  const defaultToReroll = bestDiceToReroll({
    roll: { dices, modifiers },
    max: bypassMax ? 3 : max,
  });
  const [toReroll, setToReroll] = useState(defaultToReroll);

  const toggle = (index) => {
    if (toReroll.includes(index)) {
      return setToReroll(toReroll.filter((i) => i !== index));
    }
    return setToReroll([...toReroll, index]);
  };

  const buttonText = () => {
    if (toReroll.length === 0) {
      return "Don't reroll anything";
    }

    if (toReroll.length === 1) {
      return "Reroll that die";
    }

    return "Reroll these dice";
  };

  const text = () => {
    if (bypassMax) {
      return `Thanks to your Distinction and your School Ability, you can select up to ${max} plus your school rank dice to be rerolled.`;
    }

    return `Thanks to your Distinction, you can select up to ${max} dice to be rerolled.`;
  };

  const title = () => {
    if (modifiers.includes("deathdealer")) {
      return "Distinction + Bayushi Deathdealer";
    }

    if (modifiers.includes("manipulator")) {
      return "Distinction + Bayushi Manipulator";
    }

    return "Distinction";
  };

  return (
    <RerollDiceBox
      title={title()}
      text={text()}
      dices={dices.map((dice, index) => {
        const selected = toReroll.includes(index);
        const selectable = selected || toReroll.length < max || bypassMax;
        return {
          ...dice,
          selectable,
          selected,
          disabled: !selectable,
          toggle: () => toggle(index),
        };
      })}
      footer={
        <NextButton onClick={() => onFinish(toReroll)}>
          {buttonText()}
        </NextButton>
      }
    />
  );
};

export default Distinction;
