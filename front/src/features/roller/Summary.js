import React from "react";
import { Typography } from "antd";
import Dice from "./Dice";
import styles from "./Summary.module.less";
import {
  orderDices,
  isSpecialReroll,
  isSpecialAlteration,
  getMysteriousModifierLabel,
  getCustomLabel,
} from "./utils";
import ABILITIES from "./data/abilities";
import CharacterSheet from "../display/CharacterSheet";
import {
  distinctions,
  adversities,
  passions,
  anxieties,
} from "./data/advantages";
import Description from "features/trinket/Description";

const { Text } = Typography;

const Modifiers = ({ modifiers }) => {
  return (
    <ol className={styles["other-modifiers"]}>
      {modifiers.map((modifier, index) => {
        return <li key={index.toString()}>{modifier}</li>;
      })}
    </ol>
  );
};

const Summary = ({
  campaign,
  character,
  description,
  tn,
  ring,
  skill,
  modifiers,
  player,
  channeled,
  addkept,
  metadata,
}) => {
  const modifierToAssist = (modifier) => {
    if (!modifier) {
      return 0;
    }

    return parseInt(modifier.slice(-2));
  };
  const skilledAssist = modifierToAssist(
    modifiers.find((modifier) => /^skilledassist([0-9]{2})$/.test(modifier))
  );
  const unskilledAssist = modifierToAssist(
    modifiers.find((modifier) => /^unskilledassist([0-9]{2})$/.test(modifier))
  );
  const extraRingDice = (modifiers.includes("void") ? 1 : 0) + unskilledAssist;
  const extraSkillDice =
    (modifiers.includes("wandering") ? 1 : 0) + skilledAssist;

  const namedModifiers = metadata?.["advantages"] || [];
  const distinction = () => {
    if (!modifiers.includes("distinction")) {
      return false;
    }
    const name = namedModifiers.find((name) => distinctions.includes(name));
    if (name) {
      return `Distinction: ${name}`;
    }
    return `Distinction`;
  };
  const adversity = () => {
    if (!modifiers.includes("adversity")) {
      return false;
    }
    const name = namedModifiers.find((name) => adversities.includes(name));
    if (name) {
      return `Adversity: ${name}`;
    }
    return `Adversity`;
  };

  const special = [
    ...[
      modifiers.includes("unrestricted") && "Fully customized roll",
      modifiers.includes("void") && "Seize the Moment",
      modifiers.includes("compromised") && "Compromised",
      modifiers.includes("offering") && "Proper Offerings",
      adversity(),
      distinction(),
      ...namedModifiers
        .filter((name) => passions.includes(name))
        .map((name) => `Passion: ${name}`),
      ...namedModifiers
        .filter((name) => anxieties.includes(name))
        .map((name) => `Anxiety: ${name}`),
      skilledAssist > 0 && `Skilled Assistance x${skilledAssist}`,
      unskilledAssist > 0 && `Unskilled Assistance x${unskilledAssist}`,
      modifiers.includes("stirring") && "Shūji — Stirring the Embers",
    ],
    ...modifiers
      .filter((modifier) => !!ABILITIES[modifier])
      .map((modifier) => `${ABILITIES[modifier]["school"]} School Ability`),
    ...modifiers
      .filter(
        (modifier) => isSpecialReroll(modifier) || isSpecialAlteration(modifier)
      )
      .map((modifier) => getMysteriousModifierLabel({ modifier, metadata })),
    (() => {
      const name = getCustomLabel({ modifier: "addkept", metadata });
      return name && `“${name}”`;
    })(),
  ].filter(Boolean);

  const data = [
    description && {
      label: `Description`,
      content: <Description>{description}</Description>,
    },

    {
      label: `Dice Pool`,
      content: [
        {
          label: `Ring`,
          content:
            extraRingDice > 0 ? (
              <>
                <Text>{ring}</Text>
                <Text type="secondary">{` + ${extraRingDice}`}</Text>
              </>
            ) : (
              ring
            ),
        },
        {
          label: `Skill`,
          content:
            extraSkillDice > 0 ? (
              <>
                <Text>{skill}</Text>
                <Text type="secondary">{` + ${extraSkillDice}`}</Text>
              </>
            ) : (
              skill
            ),
        },
      ],
    },
    tn && {
      label: `TN`,
      content: <Text className={styles.center}>{tn}</Text>,
    },
    metadata?.approach && {
      label: `Approach`,
      content: (() => {
        const [ring, skill] = metadata.approach.split("|");
        return `${skill} (${ring})`;
      })(),
    },
    special.length > 0 && {
      label: `Modifiers`,
      content: <Modifiers modifiers={special} />,
    },
    channeled?.length && {
      label: `Rolled Dice Forced`,
      content: (
        <div className={styles.dices}>
          {orderDices(channeled).map((dice, index) => {
            return <Dice key={index.toString()} dice={dice} />;
          })}
        </div>
      ),
    },
    addkept?.length && {
      label: `Kept Dice Added`,
      content: (
        <div className={styles.dices}>
          {orderDices(addkept).map((dice, index) => {
            return <Dice key={index.toString()} dice={dice} />;
          })}
        </div>
      ),
    },
  ].filter(Boolean);

  return (
    <div className={styles.container}>
      <CharacterSheet data={data} identity={{ character, campaign, player }} />
    </div>
  );
};

export default Summary;
