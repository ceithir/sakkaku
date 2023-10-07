import React from "react";
import styles from "./Layout.module.less";
import Context from "./Context";
import Title from "features/display/Title";

const Layout = ({ children, dices, context, instruction }) => {
  return (
    <div className={styles.layout}>
      <Title>{`Legend of the Five Rings (FFG) – Heritage Roll`}</Title>
      <Context {...context} dices={dices} />
      {instruction && (
        <div className={styles.instruction}>
          <p>{instruction}</p>
        </div>
      )}
      <>{children}</>
    </div>
  );
};

export default Layout;
