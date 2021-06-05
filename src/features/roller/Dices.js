import React from "react";
import styles from "./Dices.module.less";
import classNames from "classnames";
import Dice from "./Dice";

const StaticDice = ({ dice, theme }) => {
  const { selected, disabled, value } = dice;

  return (
    <div
      className={classNames(styles.dice, {
        [styles.selected]: selected,
        [styles.unselectable]: disabled,
        [styles[`theme-${theme}`]]: !!theme,
        [styles.explosion]: value?.explosion,
      })}
    >
      <Dice dice={dice} />
    </div>
  );
};

const Dices = ({ dices, theme, className }) => {
  if (!dices?.length) {
    return null;
  }

  const isForm = dices.some(({ selectable }) => selectable);

  if (isForm) {
    return (
      <form className={classNames(styles.dices, { [className]: !!className })}>
        {dices.map((dice, index) => {
          const key = index.toString();
          const { selectable, selected, disabled, toggle, value } = dice;

          if (!selectable) {
            return <StaticDice key={key} dice={dice} theme={theme} />;
          }

          return (
            <label
              key={key}
              className={classNames(styles.dice, {
                [styles.selectable]: true,
                [styles.selected]: selected,
                [styles.unselectable]: disabled,
                [styles[`theme-${theme}`]]: !!theme,
                [styles.explosion]: value?.explosion,
              })}
            >
              <Dice dice={dice} />
              <input type="checkbox" checked={selected} onChange={toggle} />
            </label>
          );
        })}
      </form>
    );
  }

  return (
    <div className={classNames(styles.dices, { [className]: !!className })}>
      {dices.map((dice, index) => {
        return <StaticDice key={index.toString()} dice={dice} theme={theme} />;
      })}
    </div>
  );
};

export default Dices;
