import React from "react";
import { Typography } from "antd";
import { entry } from "../heritage/data/heritage";

const { Text } = Typography;

const HeritageResult = ({
  result: [firstRoll, secondRoll],
  metadata: { table },
}) => {
  const { name, effect } = entry({ table, firstRoll, secondRoll });

  const option =
    typeof effect === "object" &&
    secondRoll &&
    effect.options.find(
      ({ min, max }) => min <= secondRoll && max >= secondRoll
    );

  if (!option) {
    return <Text strong>{name}</Text>;
  }

  return (
    <>
      <Text strong>{name}</Text>
      <>{` / `}</>
      <Text strong>{option.text}</Text>
    </>
  );
};

export default HeritageResult;
