import React from "react";
import { Typography } from "antd";

const { Text } = Typography;

const TextResult = ({ parameters, dice }) => {
  const { modifier, tn } = parameters;
  const textModifier =
    !!modifier && (modifier > 0 ? `+${modifier}` : `${modifier}`);
  const total = dice.reduce((prev, cur) => prev + cur, 0) + modifier;

  const resultColor = () => {
    if (!tn) {
      return "default";
    }
    return total >= tn ? "success" : "danger";
  };

  if (!modifier && dice.length === 1) {
    return (
      <>
        {`"1d10" ⇒ `}
        <Text strong={true} type={resultColor()}>
          {total}
        </Text>
      </>
    );
  }

  return (
    <>
      {`"1d10"`}
      {textModifier}
      {` ⇒ ${dice.join("+").replace("+-", "-")}`}
      {textModifier}
      {` ⇒ `}
      <Text strong={true} type={resultColor()}>
        {total}
      </Text>
    </>
  );
};

export default TextResult;
