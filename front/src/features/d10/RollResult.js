import React from "react";
import { Typography } from "antd";
import styles from "./RollResult.module.less";
import { stringify } from "./formula";
import classNames from "classnames";

const { Text } = Typography;

const TransitionArrow = () => {
  return <span className={styles.separator}>{` ⇒ `}</span>;
};

const RollResult = ({ dice, parameters, className }) => {
  const modifier = parameters.modifier || 0;
  const total =
    dice
      .filter(({ status }) => status === "kept")
      .reduce((acc, { value }) => acc + value, 0) + modifier;
  const tn = parameters.tn;

  return (
    <div className={classNames(styles.result, { [className]: !!className })}>
      <Text strong={true}>{stringify(parameters)}</Text>
      <TransitionArrow />
      <span className={styles.dice}>
        {dice.map(({ status, value }, index) => {
          return (
            <React.Fragment key={index.toString()}>
              <Text disabled={status !== "kept"} strong={status === "kept"}>
                {value}
              </Text>
              {status === "rerolled" && (
                <Text
                  disabled={true}
                  className={styles["reroll-arrow"]}
                >{`↪`}</Text>
              )}
            </React.Fragment>
          );
        })}
      </span>
      {!!modifier && (
        <Text className={styles.modifier}>
          {modifier > 0 ? ` +${modifier}` : ` ${modifier}`}
        </Text>
      )}
      <TransitionArrow />
      <Text
        strong={true}
        type={!tn ? "default" : total >= tn ? "success" : "danger"}
      >
        {total}
      </Text>
    </div>
  );
};

export default RollResult;
