import React from "react";
import { Typography } from "antd";
import styles from "./TextResult.module.less";

const { Text } = Typography;

const groupDice = (dice) => {
  if (!dice.length) {
    return [[]];
  }

  let grouped = [];
  let currentType;
  let currentGroup = [];

  const addGroup = () => {
    grouped.push({
      type: `${currentGroup.length}${currentType}`,
      values: currentGroup,
    });
    currentGroup = [];
  };

  dice.forEach(({ type, value, status }) => {
    if (!currentType) {
      currentType = type;
    }
    if (currentType !== type) {
      addGroup();
      currentType = type;
    }
    currentGroup.push({ value, status });
  });
  addGroup();
  return grouped;
};

const TextResult = ({ parameters, dice }) => {
  const modifier = parameters.modifier;

  const total = dice
    .filter(({ status }) => status === "kept")
    .reduce((acc, { value }) => {
      return acc + value;
    }, modifier);

  return (
    <>
      <>
        {groupDice(dice).map(({ type, values }, index) => (
          <React.Fragment key={index.toString()}>
            {index > 0 && ` + `}
            <span className={styles["dice-group"]}>
              <span className={styles.values}>
                {values.map(({ value, status }, index) => {
                  const dropped = status === "dropped";
                  return (
                    <Text
                      delete={dropped}
                      type={dropped && "secondary"}
                      key={index.toString()}
                    >
                      {index > 0 && `+`}
                      {value}
                    </Text>
                  );
                })}
              </span>
              <span className={styles.type}>{type}</span>
            </span>
          </React.Fragment>
        ))}
        {!!modifier && <>{modifier > 0 ? ` +${modifier}` : ` ${modifier}`}</>}
        {` ⇒ `}
      </>
      <Text
        strong={true}
        type={
          parameters.tn
            ? total >= parameters.tn
              ? "success"
              : "danger"
            : undefined
        }
      >
        {total}
      </Text>
    </>
  );
};

export default TextResult;
