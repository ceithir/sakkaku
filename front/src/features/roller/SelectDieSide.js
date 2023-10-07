import React from "react";
import { Select } from "antd";
import Dice from "./Dice";
import styles from "./SelectDieSide.module.less";
const SEPARATOR = "-";

const toString = ({
  type,
  value: { opportunity, strife, success, explosion },
}) => {
  return [
    type,
    ...[opportunity, strife, success, explosion].map((number) =>
      (number || 0).toString()
    ),
  ].join(SEPARATOR);
};

const toObject = (string) => {
  const [type, ...value] = string.split(SEPARATOR);
  const [opportunity, strife, success, explosion] = value.map((s) =>
    parseInt(s)
  );
  return {
    type,
    value: {
      opportunity,
      strife,
      success,
      explosion,
    },
  };
};

export const FACETS = [
  { type: "ring", value: {} },
  { type: "ring", value: { opportunity: 1, strife: 1 } },
  { type: "ring", value: { opportunity: 1 } },
  { type: "ring", value: { success: 1 } },
  { type: "ring", value: { success: 1, strife: 1 } },
  { type: "ring", value: { explosion: 1, strife: 1 } },
  { type: "skill", value: {} },
  { type: "skill", value: { opportunity: 1 } },
  { type: "skill", value: { success: 1, strife: 1 } },
  { type: "skill", value: { success: 1 } },
  { type: "skill", value: { explosion: 1, strife: 1 } },
  { type: "skill", value: { success: 1, opportunity: 1 } },
  { type: "skill", value: { explosion: 1 } },
];

const SelectDieSide = ({
  value,
  onChange,
  facets = FACETS,
  initialValue,
  ...props
}) => {
  return (
    <Select
      {...props}
      className={styles.select}
      options={facets.map((die) => {
        return {
          value: toString(die),
          label: <Dice dice={die} />,
        };
      })}
      value={value ? toString(value) : undefined}
      onChange={
        onChange ? (value) => !!value && onChange(toObject(value)) : undefined
      }
      defaultValue={initialValue ? toString(initialValue) : undefined}
    />
  );
};

export default SelectDieSide;
