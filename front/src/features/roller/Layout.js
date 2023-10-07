import React from "react";
import Title from "../display/Title";
import styles from "./Layout.module.less";

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Title>{`Legend of the Five Rings (FFG) – Check Roll`}</Title>
      <>{children}</>
    </div>
  );
};

export default Layout;
