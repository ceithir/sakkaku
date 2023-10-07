import React from "react";
import CharacterSheet from "../display/CharacterSheet";
import styles from "./Context.module.less";
import classNames from "classnames";
import TABLES from "./data/heritage";
import Description from "features/trinket/Description";

const Context = ({
  character,
  campaign,
  user,
  description,
  dices = [],
  metadata: { table } = {},
}) => {
  const [firstDie, secondDie, thirdDie] = dices;
  const picked = dices.find(({ status }) => status === "kept");

  const data = [
    dices.length > 0 && {
      label: "Dice",
      content: [
        { label: "Rolled", content: `${firstDie.value} / ${secondDie.value}` },
        {
          label: "Picked",
          content: picked?.value || `?`,
        },
        { label: "Effect", content: thirdDie?.value || `?` },
      ],
    },
    description && {
      label: `Description`,
      content: <Description>{description}</Description>,
    },
    table && { label: `Ref.`, content: TABLES[table]?.name },
  ].filter(Boolean);

  if (data.length === 0) {
    return null;
  }

  return (
    <div
      className={classNames(styles.container, {
        [styles.expanded]: !!character,
      })}
    >
      <CharacterSheet
        data={data}
        identity={{ character, campaign, player: user }}
      />
    </div>
  );
};

export default Context;
