import React from "react";
import styles from "./LineContainer.module.css";

const LineContainer = ({ children }) => {
  return <div className={styles.buttons}>{children}</div>;
};

export default LineContainer;
