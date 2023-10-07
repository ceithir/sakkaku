import React from "react";
import Card from "./Card";
import styles from "./SmallDeck.module.less";

const SmallDeck = ({ cards }) => {
  if (!cards?.length) {
    return null;
  }

  return (
    <div className={styles.deck}>
      {cards.map((number, index) => {
        return <Card key={index.toString()} number={number} />;
      })}
    </div>
  );
};

export default SmallDeck;
