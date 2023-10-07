import React from "react";
import { Typography, Descriptions } from "antd";
import TABLES, { entry } from "./data/heritage";
import styles from "./Summary.module.less";
import classNames from "classnames";

const { Text } = Typography;

const Effect = ({ effect, roll }) => {
  if (typeof effect === "string") {
    return <>{effect}</>;
  }

  const { intro, outro, options } = effect;

  return (
    <>
      <>{intro}</>
      {options.map(({ min, max, text }, index) => {
        return (
          <React.Fragment key={min.toString()}>
            <Text strong={!!roll && min <= roll && max >= roll}>
              {max !== min ? `${min}–${max}: ${text}` : `${min}: ${text}`}
            </Text>
            {index < options.length - 1 && <>{`, `}</>}
          </React.Fragment>
        );
      })}
      <>{outro}</>
    </>
  );
};

const Summary = ({ table, rolls, className }) => {
  if (!table || !TABLES[table]) {
    return null;
  }

  const [firstRoll, secondRoll] = rolls;
  const { name, description, modifier, effect } = entry({
    table,
    firstRoll,
    secondRoll,
  });

  return (
    <div className={classNames(styles.container, { [className]: !!className })}>
      <Descriptions
        title={name}
        bordered
        layout="vertical"
        column={1}
        size="small"
      >
        <Descriptions.Item label="Result">{description}</Descriptions.Item>
        <Descriptions.Item label="Modifier">{modifier}</Descriptions.Item>
        <Descriptions.Item label="Other effects">
          <Effect effect={effect} roll={secondRoll} />
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default Summary;
