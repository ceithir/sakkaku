import { useEffect, useState } from "react";
import { Typography } from "antd";
import { getProbability } from "./probabilities";
import { LoadingOutlined } from "@ant-design/icons";

const { Text } = Typography;

let cachedRawData;

// TODO Minimal error handling
const loadRawData = async (setRawData) => {
  if (cachedRawData) {
    setRawData(cachedRawData);
    return;
  }

  const response = await fetch("/media/dice/AEG/L5R/probabilities.json");
  const data = await response.json();
  cachedRawData = data["raw"];
  setRawData(cachedRawData);
};

const Odds = ({ roll, keep, tn, explosions = [10], rerolls = [] }) => {
  const [rawData, setRawData] = useState();

  useEffect(() => {
    if (!rawData) {
      loadRawData(setRawData);
    }
  }, [rawData]);

  if (
    rerolls.includes(2) ||
    rerolls.includes(3) ||
    explosions.includes(8) ||
    tn > 100 ||
    (explosions.length === 0 && rerolls.length > 0)
  ) {
    return <Text disabled={true}>{`Unknown`}</Text>;
  }

  if (!rawData) {
    return <LoadingOutlined />;
  }

  return (
    <strong>{`${getProbability(rawData, {
      roll,
      keep,
      tn,
      explosions,
      rerolls,
    })}%`}</strong>
  );
};

export default Odds;
