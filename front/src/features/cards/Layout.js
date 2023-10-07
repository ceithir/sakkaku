import React from "react";
import styles from "./Layout.module.less";

const Layout = ({ children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.body}>{children}</div>
    </div>
  );
};

export default Layout;
