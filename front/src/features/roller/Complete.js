import React from "react";
import Reroll from "./result/Reroll";
import Keep from "./result/Keep";
import Resolve from "./result/Resolve";
import { Collapse } from "antd";
import Summary from "./Summary";
import { rolledDicesCount } from "./utils";

const { Panel } = Collapse;

const Complete = ({ dices, button, intent, context, player, metadata }) => {
  const { tn } = intent;
  const { id, description } = context;

  const basePool = rolledDicesCount(intent);
  const rerollTypes = context?.roll?.metadata?.rerolls || [];

  return (
    <Collapse defaultActiveKey={["declare", "resolve"]}>
      <Panel header="Declare" key="declare">
        <Summary {...context} {...intent} player={player} metadata={metadata} />
      </Panel>

      <Panel
        header="Modify"
        key="modify"
        collapsible={rerollTypes.length === 0 ? "disabled" : "header"}
      >
        <Reroll
          dices={dices}
          basePool={basePool}
          rerollTypes={rerollTypes}
          metadata={metadata}
        />
      </Panel>

      <Panel header="Keep" key="keep">
        <Keep dices={dices} basePool={basePool} rerollTypes={rerollTypes} />
      </Panel>
      <Panel header="Resolve" key="resolve" collapsible="disabled">
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
      </Panel>
    </Collapse>
  );
};

export default Complete;
