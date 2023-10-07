import React from "react";
import Card from "features/cards/Card";
import styles from "./CardResult.module.less";

const CardResult = ({ result: { hand } }) => {
  return (
    <div className={styles.cards}>
      {hand.map((number, index) => {
        return <Card key={index.toString()} number={number} />;
      })}
    </div>
  );
};

export default CardResult;
