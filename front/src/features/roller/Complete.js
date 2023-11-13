import React from "react";
import Reroll from "./result/Reroll";
import Keep from "./result/Keep";
import Resolve from "./result/Resolve";
import { Collapse } from "antd";
import Summary from "./Summary";
import { rolledDicesCount } from "./utils";

const Complete = ({ dices, button, intent, context, player, metadata }) => {
  const { tn } = intent;
  const { id, description } = context;

  const basePool = rolledDicesCount(intent);
  const rerollTypes = context?.roll?.metadata?.rerolls || [];

  return (
    <Collapse
      defaultActiveKey={["declare", "resolve"]}
      items={[
        {
          key: "declare",
          label: "Declare",
          children: (
            <Summary
              {...context}
              {...intent}
              player={player}
              metadata={metadata}
            />
          ),
        },
        {
          key: "modify",
          label: "Modify",
          collapsible: rerollTypes.length === 0 ? "disabled" : "header",
          children: (
            <Reroll
              dices={dices}
              basePool={basePool}
              rerollTypes={rerollTypes}
              metadata={metadata}
            />
          ),
        },
        {
          key: "keep",
          label: "Keep",
          children: (
            <Keep dices={dices} basePool={basePool} rerollTypes={rerollTypes} />
          ),
        },
        {
          key: "resolve",
          label: "Resolve",
          collapsible: "disabled",
          children: (
            <Resolve
              dices={dices}
              tn={tn}
              button={button}
              id={id}
              description={description}
              basePool={basePool}
              rerollTypes={rerollTypes}
              approach={metadata?.approach}
            />
          ),
        },
      ]}
    />
  );
};

export default Complete;
