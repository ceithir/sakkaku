import React from "react";
import styles from "./Symbol.module.less";
import { ReactComponent as SvgExplosion } from "./images/symbols/explosion.svg";
import { ReactComponent as SvgOpportunity } from "./images/symbols/opportunity.svg";
import { ReactComponent as SvgStrife } from "./images/symbols/strife.svg";
import { ReactComponent as SvgSuccess } from "./images/symbols/success.svg";

// Role and title as per https://css-tricks.com/accessible-svgs/
const defaultProps = { className: styles.image, role: "img" };

export const Strife = () => {
  return <SvgStrife {...defaultProps} />;
};

export const Success = () => {
  return <SvgSuccess {...defaultProps} />;
};

export const Explosion = () => {
  return <SvgExplosion {...defaultProps} />;
};

export const Opportunity = () => {
  return <SvgOpportunity {...defaultProps} />;
};
