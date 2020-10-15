import React, { useState } from "react";
import DicesBox from "./DicesBox";
import NextButton from "./NextButton";
import Result from "./Result";

const Keep = ({ dices, max, onFinish, compromised, trulyCompromised, tn }) => {
  const [toKeep, setToKeep] = useState([]);

  const canKeep = max > toKeep.length;
  const toggle = (index) => {
    if (toKeep.includes(index)) {
      return setToKeep(toKeep.filter((i) => i !== index));
    }
    return setToKeep([...toKeep, index]);
  };

  const text = () => {
    if (trulyCompromised) {
      return "Being compromised, you cannot keep any dice with strife… Which, in this very specific case, means you cannot keep any dice at all.";
    }

    const defaultText = `You can keep up to ${max} dice${
      max > 1 ? "s" : ""
    } (min 1).`;

    if (compromised) {
      return `${defaultText} Due to being compromised, you however cannot keep any dice with strife.`;
    }

    return defaultText;
  };

  const buttonText = () => {
    if (trulyCompromised) {
      return "Continue";
    }

    if (toKeep.length === 1) {
      return "Keep that dice";
    }

    return "Keep these dices";
  };

  return (
    <DicesBox
      title={`Keep step`}
      text={text()}
      dices={dices.map((dice, index) => {
        const selected = toKeep.includes(index);
        const available =
          dice.status === "pending" && (!compromised || !dice.value.strife);
        const selectable = (selected || canKeep) && available;
        return {
          ...dice,
          selectable,
          selected,
          disabled: !selectable,
          toggle: () => toggle(index),
        };
      })}
      footer={
        <>
          <Result dices={dices} tn={tn} extra={toKeep} />
          {(toKeep.length >= 1 || trulyCompromised) && (
            <NextButton onClick={() => onFinish(toKeep)}>
              {buttonText()}
            </NextButton>
          )}
        </>
      }
    />
  );
};

export default Keep;
