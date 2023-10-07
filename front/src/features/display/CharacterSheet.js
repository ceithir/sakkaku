import React from "react";
import styles from "./CharacterSheet.module.less";
import { CharacterLink, CampaignLink, PlayerLink } from "../navigation/Links";
import Description from "features/trinket/Description";

const buildIdentity = (identity) => {
  if (!identity?.character) {
    return [];
  }

  const { character, campaign, player } = identity;

  return [
    {
      label: `Identity`,
      content: [
        {
          label: `Campaign`,
          content: <CampaignLink campaign={campaign} />,
        },
        {
          label: `Character`,
          content: <CharacterLink campaign={campaign} character={character} />,
        },
        {
          label: `Player`,
          content: <PlayerLink player={player} />,
        },
      ],
    },
  ];
};

const buildDescription = (description) => {
  if (!description) {
    return [];
  }

  return [
    { label: `Description`, content: <Description>{description}</Description> },
  ];
};

const buildData = ({ data, identity, description }) => {
  return [
    ...buildIdentity(identity),
    ...buildDescription(description),
    ...data,
  ];
};

const buildDl = (data) => {
  return (
    <dl>
      {data.map(({ label, content }) => {
        return (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{Array.isArray(content) ? buildDl(content) : content}</dd>
          </div>
        );
      })}
    </dl>
  );
};

const CharacterSheet = ({ data, identity, description }) => {
  return (
    <div className={styles.container}>
      {buildDl(buildData({ data, identity, description }))}
    </div>
  );
};

export default CharacterSheet;
