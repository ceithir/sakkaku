import React from "react";
import styles from "./Description.module.less";

const Description = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export default Description;
