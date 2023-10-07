import React from "react";
import { Typography } from "antd";
import styles from "./ExternalLink.module.less";
// Source: https://commons.wikimedia.org/wiki/File:Icon_External_Link.svg
import { ReactComponent as ExternalLinkIcon } from "./external-link.svg";

const { Link: AntdLink } = Typography;

const ExternalLink = ({ children, ...props }) => {
  return (
    <AntdLink className={styles.link} {...props}>
      {children}
      <ExternalLinkIcon />
    </AntdLink>
  );
};

export default ExternalLink;
