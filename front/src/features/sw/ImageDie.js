import React from "react";

const imgUrlRoot = `/media/dice`;

export const diceToImageSrc = (
  {
    type,
    value: {
      success = 0,
      advantage = 0,
      triumph = 0,
      failure = 0,
      threat = 0,
      despair = 0,
      light = 0,
      dark = 0,
    },
  },
  { resolution = 60 } = {}
) => {
  return `${imgUrlRoot}/FFG/SW/${type}/suc${success}adv${advantage}tri${triumph}fai${failure}thr${threat}des${despair}lig${light}dar${dark}-${resolution}.png`;
};
const diceToImageSrcSet = (dice) => {
  return [1, 2, 3]
    .map((n) => `${diceToImageSrc(dice, { resolution: 60 * n })} ${n}x`)
    .join(", ");
};

const getText = ({
  value: {
    success = 0,
    advantage = 0,
    triumph = 0,
    failure = 0,
    threat = 0,
    despair = 0,
    light = 0,
    dark = 0,
  },
}) => {
  return (
    [
      success && `Success: ${success}`,
      advantage && `Advantage: ${advantage}`,
      triumph && `Triumph: ${triumph}`,

      failure && `Failure: ${failure}`,
      threat && `Threat: ${threat}`,
      despair && `Despair: ${despair}`,

      light && `Light: ${light}`,
      dark && `Dark: ${dark}`,
    ]
      .filter(Boolean)
      .join("; ") || "Blank"
  );
};

const ImageDie = ({ ...die }) => {
  return (
    <img
      src={diceToImageSrc(die)}
      alt={getText(die)}
      title={getText(die)}
      srcSet={diceToImageSrcSet(die)}
    />
  );
};

export default ImageDie;
