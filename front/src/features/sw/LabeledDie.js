import React from "react";
import styles from "./LabeledDie.module.less";
import abiltyDie from "./images/ability-60.png";
import boostDie from "./images/boost-60.png";
import challengeDie from "./images/challenge-60.png";
import difficultyDie from "./images/difficulty-60.png";
import forceDie from "./images/force-60.png";
import proficiencyDie from "./images/proficiency-60.png";
import setbackDie from "./images/setback-60.png";
import classNames from "classnames";

const LabeledDie = ({ label, src, className }) => {
  return (
    <span
      className={classNames(styles.container, { [className]: !!className })}
    >
      {label}
      <img src={src} alt={label + ` die`} />
    </span>
  );
};

export const AbilityDie = () => {
  return <LabeledDie label={`Ability`} src={abiltyDie} />;
};

export const BoostDie = () => {
  return <LabeledDie label={`Boost`} src={boostDie} />;
};

export const ChallengeDie = () => {
  return (
    <LabeledDie
      label={`Challenge`}
      src={challengeDie}
      className={styles.challenge}
    />
  );
};

export const DifficutlyDie = () => {
  return <LabeledDie label={`Difficulty`} src={difficultyDie} />;
};

export const ForceDie = () => {
  return <LabeledDie label={`Force`} src={forceDie} />;
};

export const ProficiencyDie = () => {
  return (
    <LabeledDie
      label={`Proficiency`}
      src={proficiencyDie}
      className={styles.proficiency}
    />
  );
};

export const SetbackDie = () => {
  return <LabeledDie label={`Setback`} src={setbackDie} />;
};

export default LabeledDie;
