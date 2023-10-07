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

const LabeledDie = ({ label, src, alt, className }) => {
  return (
    <span
      className={classNames(styles.container, { [className]: !!className })}
    >
      {label}
      <img src={src} alt={alt} />
    </span>
  );
};

export const AbilityDie = () => {
  return <LabeledDie label={`Ability`} src={abiltyDie} alt={`Ability die`} />;
};

export const BoostDie = () => {
  return <LabeledDie label={`Boost`} src={boostDie} alt={`Boost die`} />;
};

export const ChallengeDie = () => {
  return (
    <LabeledDie
      label={`Challenge`}
      src={challengeDie}
      alt={`Challenge die`}
      className={styles.challenge}
    />
  );
};

export const DifficutlyDie = () => {
  return (
    <LabeledDie
      label={`Difficulty`}
      src={difficultyDie}
      alt={`Difficulty die`}
    />
  );
};

export const ForceDie = () => {
  return <LabeledDie label={`Force`} src={forceDie} alt={`Force die`} />;
};

export const ProficiencyDie = () => {
  return (
    <LabeledDie
      label={`Proficiency`}
      src={proficiencyDie}
      alt={`Proficiency die`}
      className={styles.proficiency}
    />
  );
};

export const SetbackDie = () => {
  return <LabeledDie label={`Setback`} src={setbackDie} alt={`Setback die`} />;
};

export default LabeledDie;
