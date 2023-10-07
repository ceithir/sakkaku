import React, { useState } from "react";
import NextButton from "../NextButton";
import RerollDiceBox from "./RerollDiceBox";
import { bestDiceToReroll } from "../utils";
import { Button } from "antd";
import styles from "./Offering.module.less";

const Offering = ({
  dices,
  onFinish,
  basePool,
  rerollTypes,
  modifiers,
  delay,
}) => {
  const max = 3;
  const isBlank = ({ value: { opportunity, success, explosion, strife } }) =>
    success === 0 && explosion === 0 && opportunity === 0 && strife === 0;
  const defaultToReroll = bestDiceToReroll({
    roll: { dices, modifiers },
    max,
    restrictFunc: isBlank,
  });
  const [toReroll, setToReroll] = useState(defaultToReroll);

  const toggle = (index) => {
    if (toReroll.includes(index)) {
      return setToReroll(toReroll.filter((i) => i !== index));
    }
    return setToReroll([...toReroll, index]);
  };
  const text = `You may reroll up to 3 rolled dice showing blank results.`;

  return (
    <RerollDiceBox
      title={`Proper Offerings`}
      text={text}
      dices={dices.map((dice, index) => {
        const selected = toReroll.includes(index);
        const isSelectable = () => {
          if (selected) {
            return true;
          }

          if (toReroll.length === max) {
            return false;
          }

          return isBlank(dice);
        };
        const selectable = isSelectable();

        return {
          ...dice,
          selectable,
          selected,
          disabled: !selectable,
          toggle: () => toggle(index),
        };
      })}
      basePool={basePool}
      rerollTypes={rerollTypes}
      footer={
        <div className={styles.buttons}>
          {delay && (
            <Button onClick={delay}>{`Resolve after Distinction`}</Button>
          )}
          <NextButton
            disabled={toReroll.length > max}
            onClick={() => onFinish(toReroll)}
          >
            {`Continue`}
          </NextButton>
        </div>
      }
    />
  );
};

export default Offering;
