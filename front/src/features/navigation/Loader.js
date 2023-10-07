import React from "react";
import { Spin } from "antd";
import styles from "./Loader.module.css";
import classNames from "classnames";

const Loader = ({ className }) => {
  return (
    <div className={classNames(styles.container, { [className]: !!className })}>
      <Spin className={styles.loader} size="large" />
    </div>
  );
};

export default Loader;
