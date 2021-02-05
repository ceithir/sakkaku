import React from "react";
import { Typography, Table } from "antd";
import TABLES from "./tables";

const { Text } = Typography;

const columns = [
  { title: "Roll", dataIndex: "roll" },
  {
    title: "Result",
    dataIndex: "succinct",
    render: ({ name, effect, secondRoll }) => {
      const option =
        typeof effect === "object" &&
        secondRoll &&
        effect.options.find(
          ({ min, max }) => min <= secondRoll && max >= secondRoll
        );

      if (!option) {
        return <Text strong>{name}</Text>;
      }

      return (
        <>
          <Text strong>{name}</Text>
          <>{` / `}</>
          <Text strong>{option.text}</Text>
        </>
      );
    },
  },
  { title: "Ref.", dataIndex: "book" },
];

const List = ({ rolls }) => {
  return (
    <Table
      columns={columns}
      dataSource={rolls.map(({ dices, metadata }, index) => {
        const key = index.toString();
        const [firstRoll, secondRoll] = dices
          .filter(({ status }) => status === "kept")
          .map(({ value }) => value);
        const { table } = metadata;

        // TODO: Handle weird cases better
        if (!firstRoll || !table || !TABLES[table]) {
          return {
            key,
            book: "???",
            roll: "???",
            succinct: { name: "???" },
          };
        }

        const { name, effect } = TABLES[table]["entries"][firstRoll - 1];

        return {
          key,
          book: TABLES[table]["name"],
          roll: [firstRoll, secondRoll].filter(Boolean).join(" / "),
          succinct: { name, effect, secondRoll },
        };
      })}
      pagination={false}
    />
  );
};

export default List;
