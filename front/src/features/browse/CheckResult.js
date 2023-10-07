import React from "react";
import styles from "./CheckResult.module.css";
import { Success, Opportunity, Strife } from "../display/Symbol";

const CheckResult = ({ opportunity, success, strife }) => {
  return (
    <div className={styles.result}>
      <Success />
      <span>{`: ${success}, `}</span>
      <Opportunity />
      <span>{`: ${opportunity}, `}</span>
      <Strife />
      <span>{`: ${strife}`}</span>
    </div>
  );
};

export default CheckResult;
