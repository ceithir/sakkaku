import { Typography } from "antd";
import { getProbability } from "./probabilities";

const { Text } = Typography;

const Odds = ({ roll, keep, tn, explosions = [10], rerolls = [] }) => {
  if (
    rerolls.includes(2) ||
    rerolls.includes(3) ||
    explosions.includes(8) ||
    tn > 100
  ) {
    return <Text disabled={true}>{`Unknown`}</Text>;
  }

  return (
    <strong>{`${getProbability({
      roll,
      keep,
      tn,
      explosions,
      rerolls,
    })}%`}</strong>
  );
};

export default Odds;
