import React from "react";
import Title from "features/display/Title";
import styles from "./Layout.module.less";

const Layout = ({ children }) => {
  return (
    <div className={styles.container}>
      <Title>{`Cyberpunk RED`}</Title>
      <>{children}</>
    </div>
  );
};

export default Layout;
