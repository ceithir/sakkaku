import React from "react";
import { isAForceRoll, netSuccesses, netAdvantages } from "features/sw/Result";
import { Typography } from "antd";

const { Text } = Typography;

const FFGSWResult = ({ parameters, result }) => {
  if (isAForceRoll(parameters)) {
    return `${result.light} | ${result.dark}`;
  }

  return (
    <div>
      <Text strong={true}>{`${netSuccesses(result)}`}</Text>
      {` / `}
      <Text type="secondary">{netAdvantages(result)}</Text>
    </div>
  );
};

export default FFGSWResult;
