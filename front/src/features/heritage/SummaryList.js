import React from "react";
import styles from "./SummaryList.module.less";
import Summary from "./Summary";

const SummaryList = ({ list, table }) => {
  return (
    <div className={styles.container}>
      {list.map(({ rolls, footer }, index) => {
        return (
          <div key={index.toString()}>
            <Summary table={table} rolls={rolls} />
            {footer}
          </div>
        );
      })}
    </div>
  );
};

export default SummaryList;
