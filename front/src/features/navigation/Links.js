import React from "react";
import { Typography } from "antd";
import queryString from "query-string";
import { Link } from "react-router-dom";

const { Text } = Typography;

export const CharacterLink = ({ character, campaign }) => {
  return (
    <Link to={`/rolls?${queryString.stringify({ campaign, character })}`}>
      {character}
    </Link>
  );
};

export const CampaignLink = ({ campaign }) => {
  return (
    <Link to={`/rolls?${queryString.stringify({ campaign })}`}>{campaign}</Link>
  );
};

export const PlayerLink = ({ player }) => {
  if (!player) {
    return <Text delete>{`Deleted account`}</Text>;
  }

  return (
    <Link to={`/rolls?${queryString.stringify({ player: player.id })}`}>
      {player.name}
    </Link>
  );
};
