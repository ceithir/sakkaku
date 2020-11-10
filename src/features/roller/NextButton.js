import React from "react";
import { Button } from "antd";
import styles from "./NextButton.module.css";
import { useSelector } from "react-redux";
import { selectLoading } from "./reducer";

const NextButton = ({ children, disabled, ...props }) => {
  const loading = useSelector(selectLoading);

  return (
    <Button
      type="primary"
      className={styles.button}
      disabled={disabled || loading}
      {...props}
    >
      {children}
    </Button>
  );
};

export default NextButton;
