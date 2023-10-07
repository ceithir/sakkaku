import React from "react";
import Result from "../Result";
import styles from "./Resolve.module.less";
import Dices from "../Dices";
import { replaceRerolls, orderDices } from "../utils";
import LineContainer from "../button/LineContainer";
import { Typography } from "antd";
import OppExamples from "./OppExamples";
import CopyButtons from "components/aftermath/CopyButtons";
import { diceToImageSrc } from "../Dice";
import { countDices } from "../utils";

const link = (id) => !!id && `${window.location.origin}/rolls/${id}`;
const bbMessage = ({ id, description, tn, modifiers = [], cleanedUpDice }) => {
  const { successCount, opportunityCount, strifeCount, blankCount } =
    countDices(cleanedUpDice);

  let result = [
    {
      label: "Success",
      value: successCount,
    },
    {
      label: "Opportunity",
      value: opportunityCount,
    },
    {
      label: "Strife",
      value: strifeCount,
    },
  ];

  if (modifiers.includes("ishiken")) {
    result.push({
      label: "Magnitude",
      value: blankCount,
    });
  }

  const shortResult = result
    .map(({ label, value }) => `${label}: [b]${value}[/b]`)
    .join(" / ");

  const url = link(id);

  return (
    `${description} | TN: ${tn || "?"} | ${shortResult}[/url]` +
    "\n" +
    `[url=${url}]${cleanedUpDice
      .map(
        (dice) => `[img]${window.location.origin}${diceToImageSrc(dice)}[/img]`
      )
      .join(" ")}`
  );
};

const { Text, Paragraph } = Typography;

const isRelevantDice = ({ status }) =>
  status === "kept" || status === "channeled";
const isASetDice = (dice) =>
  ["channeled", "addkept"].includes(dice?.metadata?.source);

const Resolve = ({
  dices,
  tn,
  description,
  id,
  button,
  basePool,
  rerollTypes,
  approach,
}) => {
  const isChannel = dices.some(({ status }) => status === "channeled");

  const cleanedUpDice = orderDices(
    replaceRerolls({ dices, basePool, rerollTypes }).filter(isRelevantDice)
  ).map((dice) => {
    if (isASetDice(dice)) {
      return { ...dice, className: styles["set-die"] };
    }

    return dice;
  });

  const setDice = dices.filter(isRelevantDice).filter(isASetDice);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {isChannel && (
          <Text
            className={styles["channel-text"]}
          >{`The following dice were reserved for a later roll.`}</Text>
        )}
        <Dices dices={cleanedUpDice} />
        {setDice.length > 0 && (
          <Paragraph type="secondary">
            {setDice.length > 1
              ? `*These dice were not rolled but set to those values.`
              : `*This die was not rolled but set to that value.`}
          </Paragraph>
        )}
        {!isChannel && <Result dices={dices} tn={tn} modifiers={rerollTypes} />}
      </div>
      {!isChannel && <OppExamples approach={approach} dices={dices} tn={tn} />}
      <LineContainer>
        <CopyButtons
          link={link(id)}
          bbMessage={bbMessage({
            id,
            description,
            tn,
            modifiers: rerollTypes,
            cleanedUpDice,
          })}
        />
        {button}
      </LineContainer>
    </div>
  );
};

export default Resolve;
