import React from "react";
import ImageDie from "./ImageDie";
import styles from "./Result.module.less";
import { Typography } from "antd";

const { Text } = Typography;

export const isAForceRoll = ({
  ability,
  boost,
  challenge,
  difficulty,
  proficiency,
  setback,
  force,
}) => {
  return (
    force > 0 &&
    ability === 0 &&
    boost === 0 &&
    challenge === 0 &&
    difficulty === 0 &&
    proficiency === 0 &&
    setback === 0
  );
};

export const netSuccesses = ({ success, failure, triumph, despair }) =>
  success + triumph - failure - despair;

export const netAdvantages = ({ advantage, threat }) => advantage - threat;

const Additions = ({ parameters, result }) => {
  if (isAForceRoll(parameters)) {
    return null;
  }

  const { triumph, despair } = result;

  const netS = netSuccesses(result);
  const netA = netAdvantages(result);

  const dataSource = [
    {
      label: `Net Successes (including Triumph and Despair)`,
      value: netS,
      color: netS > 0 ? "success" : "danger",
    },
    {
      label: `Net Advantages`,
      value: netA,
      color: netA >= 0 ? null : "warning",
    },
    {
      label: `Triumph`,
      value: triumph,
    },
    {
      label: `Despair`,
      value: despair,
    },
  ];

  return (
    <div className={styles.additions}>
      {dataSource.map(({ label, value, color }, index) => {
        return (
          <span key={index.toString()}>
            {label}
            {`: `}
            <Text strong={true} type={color}>
              {value}
            </Text>
          </span>
        );
      })}
    </div>
  );
};

const Summary = ({ parameters, result }) => {
  return (
    <div className={styles.summary}>
      <Additions parameters={parameters} result={result} />
      {parameters.force > 0 && (
        <div className={styles.force}>
          <Text>{`Light: ${result.light}`}</Text>
          <Text>{`Dark: ${result.dark}`}</Text>
        </div>
      )}
    </div>
  );
};

const diceOrder = [
  "boost",
  "ability",
  "proficiency",
  "setback",
  "difficulty",
  "challenge",
  "force",
];
export const sortDice = (dice) => {
  const sorted = [...dice];
  sorted.sort(({ type: a }, { type: b }) => {
    return diceOrder.indexOf(a) - diceOrder.indexOf(b);
  });
  return sorted;
};

const Dice = ({ dice }) => {
  return (
    <div className={styles.dice}>
      {sortDice(dice).map((die, index) => {
        return <ImageDie key={index.toString()} {...die} />;
      })}
    </div>
  );
};

const Result = ({ parameters, dice }) => {
  const result = {
    success: 0,
    failure: 0,
    triumph: 0,
    despair: 0,
    advantage: 0,
    threat: 0,
    light: 0,
    dark: 0,
  };
  dice.forEach((die) => {
    Object.keys(result).forEach((key) => {
      result[key] += die["value"][key];
    });
  });

  return (
    <div className={styles.container}>
      <Dice dice={dice} />
      <Summary parameters={parameters} result={result} />
    </div>
  );
};

export default Result;
