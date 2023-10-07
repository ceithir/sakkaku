import React from "react";
import { Typography, List } from "antd";
import { countDices } from "./utils";
import styles from "./Result.module.css";
import classNames from "classnames";

const { Text } = Typography;

const Result = ({ dices, tn, extra, className, modifiers = [] }) => {
  const keptDices = dices.filter(({ status }, index) => {
    return status === "kept" || (extra && extra.includes(index));
  });

  const { successCount, opportunityCount, strifeCount, blankCount } =
    countDices(keptDices);

  const data = [
    {
      type: "Success",
      count: successCount,
      color: tn ? (successCount >= tn ? "success" : "warning") : null,
      extra: tn ? ` (required: ${tn})` : " (unknown TN)",
    },
    {
      type: "Opportunity",
      count: opportunityCount,
    },
    {
      type: "Strife",
      count: strifeCount,
      color: strifeCount > 0 && "danger",
    },
  ];

  if (modifiers.includes("ishiken")) {
    data.push({
      type: "Magnitude",
      count: blankCount,
    });
    const alteredDiceCount = dices.filter(
      ({ metadata }) => metadata?.source === "ishiken"
    ).length;
    if (alteredDiceCount > 0) {
      data.push({
        type: "Fatigue from Ability",
        count: alteredDiceCount,
        color: "warning",
      });
    }
  }

  if (modifiers.includes("wandering")) {
    const diceCount = dices.filter(
      ({ metadata }) => metadata?.source === "wandering"
    ).length;
    if (diceCount > 0) {
      data.push({
        type: "Fatigue from Ability",
        count: diceCount,
        color: "warning",
      });
    }
  }

  return (
    <List
      className={classNames(styles.layout, { [className]: !!className })}
      grid={{ gutter: 16, column: 3 }}
      dataSource={data}
      renderItem={({ type, count, color, extra }) => (
        <List.Item>
          <Text strong type={color}>{`${type}: ${count}`}</Text>
          {extra && <Text>{extra}</Text>}
        </List.Item>
      )}
    />
  );
};

export default Result;
