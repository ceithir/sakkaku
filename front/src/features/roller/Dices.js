import React from "react";
import styles from "./Dices.module.less";
import classNames from "classnames";
import Dice from "./Dice";

const buildClassNames = ({ dice }) => {
  const { selected, disabled, className } = dice;

  return {
    [styles.selected]: selected,
    [styles.unselectable]: disabled,
    [className]: !!className,
  };
};

const WrappedDice = ({ dice }) => {
  return <Dice dice={dice} />;
};

const StaticDice = ({ dice }) => {
  return (
    <div
      className={classNames(styles.dice, {
        ...buildClassNames({ dice }),
      })}
    >
      <WrappedDice dice={dice} />
    </div>
  );
};

const Dices = ({ dices, className }) => {
  if (!dices?.length) {
    return null;
  }

  const isForm = dices.some(({ selectable }) => selectable);

  if (isForm) {
    return (
      <form className={classNames(styles.dices, { [className]: !!className })}>
        {dices.map((dice, index) => {
          const key = index.toString();
          const { selectable, selected, toggle } = dice;

          if (!selectable) {
            return <StaticDice key={key} dice={dice} />;
          }

          return (
            <label
              key={key}
              className={classNames(styles.dice, {
                [styles.selectable]: true,
                ...buildClassNames({ dice }),
              })}
            >
              <WrappedDice dice={dice} />
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
        return <StaticDice key={index.toString()} dice={dice} />;
      })}
    </div>
  );
};

export default Dices;
