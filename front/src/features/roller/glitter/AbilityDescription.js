import React from "react";
import { Card, Typography } from "antd";
import styles from "./AbilityDescription.module.less";
import classNames from "classnames";
import ABILITIES from "../data/abilities";

const Description = ({ name, effect, image, className, images = [] }) => {
  return (
    <Card
      className={classNames(styles.card, { [className]: !!className })}
      cover={
        <img
          src={image}
          alt=""
          srcSet={images.map(({ src, width }) => `${src} ${width}w`).join(", ")}
          sizes={
            images.length &&
            `(min-width: 768px) 240px, ${
              images.sort(({ width: a }, { width: b }) => b - a)[0]["width"]
            }px`
          }
        />
      }
    >
      <Typography className={styles.text}>
        {typeof effect === "string" ? (
          <>
            <strong>{name}</strong>
            <p>{effect}</p>
          </>
        ) : (
          effect
        )}
      </Typography>
    </Card>
  );
};

const AbilityDescription = ({ ability, className }) => {
  if (!ABILITIES[ability]) {
    return null;
  }

  return <Description {...ABILITIES[ability]} className={className} />;
};

export default AbilityDescription;
