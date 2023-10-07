import React from "react";
import { Typography } from "antd";
import styles from "./Title.module.less";

const { Title } = Typography;

const CustomTitle = ({ children }) => {
  return <Title className={styles.title}>{children}</Title>;
};

export default CustomTitle;
