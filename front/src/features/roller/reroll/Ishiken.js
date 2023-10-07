import React, { useState } from "react";
import NextButton from "../NextButton";
import { Typography } from "antd";
import styles from "./Ishiken.module.less";
import SelectDieSide from "../SelectDieSide";
import { longname } from "../data/abilities";
import Dices from "../Dices";
import { diceWrapper } from "./RerollDiceBox";
import { replaceRerolls } from "../utils";
import Dice from "../Dice";

const { Text, Paragraph, Title } = Typography;

const blank = ({ value: { opportunity, strife, success, explosion } }) =>
  opportunity === 0 && strife === 0 && success === 0 && explosion === 0;

const AVAILABLE_FACETS = {
  ring: [
    { opportunity: 1, strife: 1 },
    { opportunity: 1 },
    { success: 1, strife: 1 },
    { success: 1 },
    { explosion: 1, strife: 1 },
  ],
  skill: [
    { opportunity: 1 },
    { success: 1, strife: 1 },
    { success: 1 },
    { explosion: 1, strife: 1 },
    { success: 1, opportunity: 1 },
    { explosion: 1 },
  ],
};

const Ishiken = ({ dices, onFinish, basePool, rerollTypes }) => {
  const [alterations, setAlterations] = useState([]);

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

    const originalDice = dices[pos];
    return setAlterations([
      ...alterations,
      {
        position: pos,
        value: blank(originalDice) ? { success: 1 } : {},
        type: originalDice.type,
      },
    ]);
  };

  const alter =
    (pos) =>
    ({ value }) => {
      setAlterations(
        alterations.map((alteration) => {
          if (alteration.position === pos) {
            return {
              ...alteration,
              value,
            };
          }

          return alteration;
        })
      );
    };

  const onlyBlanks =
    alterations.length > 0 &&
    dices
      .filter((_, index) =>
        alterations.map(({ position }) => position).includes(index)
      )
      .some(blank);
  const onlyNonBlanks = alterations.length > 0 && !onlyBlanks;

  const text = (
    <Paragraph>
      {`Your School Ability allows you to receive a number of fatigue up to your school rank to either:`}
      <ul>
        <li>
          <Text
            strong={onlyNonBlanks}
            disabled={onlyBlanks}
          >{`Choose a number of dice with non-blank results equal to the fatigue you received, and alter each to a blank result.`}</Text>
        </li>
        <li>
          <Text
            strong={onlyBlanks}
            disabled={onlyNonBlanks}
          >{`Choose a number of dice with blank results equal to the fatigue you received, and alter each to a non-blank result of your choice.`}</Text>
        </li>
      </ul>
    </Paragraph>
  );

  const buttonText = () => {
    if (onlyNonBlanks) {
      return "Pull";
    }

    if (onlyBlanks) {
      return "Push";
    }

    return "Skip";
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Title level={3}>{longname("ishiken")}</Title>
        <Paragraph className={styles.text}>{text}</Paragraph>
        <Dices
          dices={diceWrapper({
            dices: organizedDice.map(({ position, ...dice }) => {
              const selected = alterations.some(
                ({ position: pos }) => pos === position
              );
              const selectable =
                (!onlyBlanks && !onlyNonBlanks) ||
                (onlyBlanks && blank(dice)) ||
                (onlyNonBlanks && !blank(dice));
              return {
                ...dice,
                selectable,
                selected,
                disabled: !selectable,
                toggle: () => toggle(position),
              };
            }),
            basePool,
            rerollTypes,
          })}
        />
      </div>
      <div className={styles.footer}>
        {onlyBlanks && (
          <div>
            <div className={styles.arrow}>{"⇩"}</div>
            <div className={styles["altered-dice"]}>
              {cleanedUpDice.map(({ position, ...dice }) => {
                const alteration = alterations.find(
                  ({ position: pos }) => position === pos
                );

                if (!!alteration) {
                  const type = dices[position]["type"];

                  return (
                    <SelectDieSide
                      key={position}
                      value={alteration}
                      onChange={alter(position)}
                      facets={AVAILABLE_FACETS[type].map((value) => {
                        return { type, value };
                      })}
                    />
                  );
                }

                return <Dice dice={dice} key={position} />;
              })}
            </div>
          </div>
        )}
        <NextButton onClick={() => onFinish(alterations)}>
          {buttonText()}
        </NextButton>
      </div>
    </div>
  );
};

export default Ishiken;
