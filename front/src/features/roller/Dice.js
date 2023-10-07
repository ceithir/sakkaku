import React from "react";

const imgUrlRoot = `/media/dice`;

export const diceToImageSrc = (
  { type, value: { opportunity = 0, success = 0, explosion = 0, strife = 0 } },
  { resolution = 60 } = {}
) => {
  return `${imgUrlRoot}/FFG/L5R/${type}/exp${explosion}opp${opportunity}str${strife}suc${success}-${resolution}.png`;
};
const diceToImageSrcSet = (dice) => {
  return [1, 2, 3]
    .map((n) => `${diceToImageSrc(dice, { resolution: 60 * n })} ${n}x`)
    .join(", ");
};

const getText = ({ value: { opportunity, strife, success, explosion } }) => {
  return (
    [
      opportunity && `Opportunity: ${opportunity}`,
      success && `Success: ${success}`,
      explosion && `Explosion: ${explosion}`,
      strife && `Strife: ${strife}`,
    ]
      .filter(Boolean)
      .join("; ") || "Blank"
  );
};

const Dice = ({ dice }) => {
  return (
    <img
      src={diceToImageSrc(dice)}
      alt={getText(dice)}
      srcSet={diceToImageSrcSet(dice)}
      title={getText(dice)}
    />
  );
};

export default Dice;
