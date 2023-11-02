import React from "react";
import { Typography } from "antd";
import { stringify, cap } from "./formula";
import Odds from "./Odds";

const { Paragraph, Text } = Typography;

const TextSummary = ({
  original,
  explosions,
  rerolls,
  select,
  tn,
  showMeTheOdds,
}) => {
  const capped = cap(original);
  const wasCapped =
    original.roll !== capped.roll ||
    original.keep !== capped.keep ||
    original.modifier !== capped.modifier;

  return (
    <>
      <Paragraph>
        <strong>
          {stringify(original)}
          {wasCapped && (
            <>
              {` ⇒ `}
              {stringify(capped)}
            </>
          )}
          {`:`}
        </strong>
        {` You will roll `}
        <strong>{capped.roll}</strong>
        {` ten-sided dice, keeping the `}
        <strong>{capped.keep}</strong>
        {` ${select === "low" ? `lowest` : `highest`} values`}
        {!!capped.modifier && (
          <>
            {`, adding `}
            <strong>{capped.modifier}</strong>
            {` to the result`}
          </>
        )}
        {`.`}
        {!!rerolls?.length && (
          <>
            {` Dice that show `}
            <strong>{rerolls.join(", ")}</strong>
            {` after the initial roll will be rerolled (once).`}
          </>
        )}
        {!!explosions?.length && (
          <>
            {` Dice that show `}
            <strong>{explosions.join(", ")}</strong>
            {` will explode (possibly several times).`}
          </>
        )}
        {showMeTheOdds && select === "high" && (
          <>
            {` `}
            <Text italic>
              {`Estimated chances of success: `}
              <Odds
                roll={capped.roll}
                keep={capped.keep}
                rerolls={rerolls}
                explosions={explosions}
                tn={tn}
              />
              {`.`}
            </Text>
          </>
        )}
      </Paragraph>
      {wasCapped && (
        <Paragraph type="warning">
          {`Note: Your requested roll was altered to obey the `}
          <em>{`The Ten Dice Rule`}</em>
          {` described on page 77 of the 4th edition core book (that rule is mostly consistent with previous editions).`}
        </Paragraph>
      )}
    </>
  );
};

export default TextSummary;
