import React from "react";
import styles from "./ExplainOptions.module.less";
import classNames from "classnames";

const ExplainOptions = ({ options, description, className }) => {
  return (
    <div className={classNames(styles.container, { [className]: !!className })}>
      {description &&
        (typeof description === "string" ? <p>{description}</p> : description)}
      {!!options?.length && (
        <dl>
          {options.map(({ label, description }) => {
            return (
              <React.Fragment key={label}>
                <dt>{label}</dt>
                <dd>{description}</dd>
              </React.Fragment>
            );
          })}
        </dl>
      )}
    </div>
  );
};

export default ExplainOptions;
