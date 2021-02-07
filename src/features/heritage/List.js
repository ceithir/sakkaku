import React from "react";
import { Typography, Table, Button } from "antd";
import TABLES, { entry } from "./tables";

const { Text } = Typography;

const columns = [
  { title: "Character", dataIndex: "character" },
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
  { title: "Ref.", dataIndex: "book", responsive: ["sm"] },
  {
    title: "",
    dataIndex: "link",
    render: ({ action }) => {
      return <Button type="link" onClick={action}>{`➥`}</Button>;
    },
  },
];

const List = ({ rolls, onClick }) => {
  return (
    <Table
      columns={columns}
      dataSource={rolls.map((roll) => {
        const { dices, metadata, context, uuid } = roll;
        const key = uuid;
        const [firstRoll, secondRoll] = dices
          .filter(({ status }) => status === "kept")
          .map(({ value }) => value);
        const { table } = metadata;
        const { name, effect } = entry({ table, firstRoll, secondRoll });

        return {
          key,
          book: TABLES[table]["name"],
          roll: [firstRoll, secondRoll].filter(Boolean).join(" / "),
          succinct: { name, effect, secondRoll },
          character: context.character || `???`,
          link: { action: () => onClick(roll) },
        };
      })}
      pagination={false}
    />
  );
};

export default List;
