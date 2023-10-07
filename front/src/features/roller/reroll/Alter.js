import React, { useState } from "react";
import NextButton from "../NextButton";
import SelectDieSide from "../SelectDieSide";
import styles from "./Alter.module.less";
import { Button } from "antd";
import RerollDiceBox from "./RerollDiceBox";
import AddLabel from "./AddLabel";
import { replaceRerolls } from "../utils";
import Dice from "../Dice";

const Alter = ({
  text,
  dices,
  onFinish,
  basePool,
  rerollTypes,
  cancel,
  showLabelInput,
  title,
}) => {
  const [alterations, setAlterations] = useState([]);
  const [label, setLabel] = useState();

  const organizedDice = dices.map((dice, index) => {
    return {
      ...dice,
      position: index,
    };
  });

  const cleanedUpDice = replaceRerolls({
    dices: organizedDice,
    rerollTypes,
    basePool,
  });

  const toggle = (pos) => {
    if (alterations.some(({ position }) => position === pos)) {
      return setAlterations(
        alterations.filter(({ position }) => position !== pos)
      );
    }

    return setAlterations([
      ...alterations,
      { position: pos, type: dices[pos]["type"], value: { success: 1 } },
    ]);
  };

  const alter =
    (pos) =>
    ({ type, value }) => {
      setAlterations(
        alterations.map((alteration) => {
          if (alteration.position === pos) {
            return {
              ...alteration,
              type,
              value,
            };
          }

          return alteration;
        })
      );
    };

  return (
    <RerollDiceBox
      title={title}
      text={text}
      dices={organizedDice.map(({ position, ...dice }) => {
        const selected = alterations.some(
          ({ position: pos }) => position === pos
        );
        return {
          ...dice,
          selectable: true,
          selected,
          disabled: false,
          toggle: () => toggle(position),
        };
      })}
      basePool={basePool}
      rerollTypes={rerollTypes}
      content={
        <>
          {alterations.length > 0 && (
            <>
              <div className={styles.arrow}>{"⇩"}</div>
              <div className={styles["altered-dice"]}>
                {cleanedUpDice.map(({ position, ...dice }) => {
                  const alteration = alterations.find(
                    ({ position: pos }) => position === pos
                  );

                  if (!!alteration) {
                    return (
                      <SelectDieSide
                        key={position}
                        value={alteration}
                        onChange={alter(position)}
                      />
                    );
                  }

                  return <Dice dice={dice} key={position} />;
                })}
              </div>
            </>
          )}
          {showLabelInput && <AddLabel onChange={setLabel} />}
        </>
      }
      footer={
        <div className={styles.buttons}>
          {cancel && <Button onClick={cancel}>{`Cancel`}</Button>}
          <NextButton
            onClick={() => onFinish(alterations, label)}
            disabled={cancel && alterations.length === 0}
          >
            {`Continue`}
          </NextButton>
        </div>
      }
    />
  );
};

export default Alter;
