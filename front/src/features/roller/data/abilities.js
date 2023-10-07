import React from "react";
import manipulatorImage from "./images/abilities/manipulator.png";
import deathdealerImage from "./images/abilities/deathdealer.jpg";
import ishikenImage from "./images/abilities/ishiken.png";
import wanderingImage from "./images/abilities/wandering.jpg";
import { Opportunity } from "../../display/Symbol";
import deathdealerImage240 from "./images/abilities/deathdealer-240w.jpg";
import ishikenImage240 from "./images/abilities/ishiken-240w.png";
import manipulatorImage240 from "./images/abilities/manipulator-240w.png";
import wanderingImage240 from "./images/abilities/wandering-240w.jpg";

const ABILITIES = {
  manipulator: {
    school: "Bayushi Manipulator",
    name: `Weakness Is My Strength`,
    effect: `When you exploit a target’s disadvantage (see Turning Advantages and Disadvantages, page 100 of the core rulebook) as part of a Scheme action, you do not need to spend a Void point, and you may reroll additional dice up to your school rank. [Core, page 78]`,
    image: manipulatorImage,
    images: [
      { src: manipulatorImage240, width: 240 },
      { src: manipulatorImage, width: 500 },
    ],
  },
  deathdealer: {
    school: "Bayushi Deathdealer",
    name: `Way of the Scorpion`,
    effect: `When you exploit a target’s disadvantage (see Turning Advantages and Disadvantages, page 100 of the core rulebook) as part of an Initiative check for a duel or an Attack action, you do not need to spend a Void point, and you may reroll additional dice up to your school rank. [Court of Stones, page 89]`,
    image: deathdealerImage,
    images: [
      { src: deathdealerImage240, width: 240 },
      { src: deathdealerImage, width: 1280 },
    ],
  },
  ishiken: {
    school: "Ishiken Initiate",
    name: `Way of the Void`,
    effect: (
      <>
        <p>
          <strong>Way of the Void</strong>
        </p>
        <p>
          <span>
            When you make a check using your Void Ring, after rolling dice, you
            may receive a number of fatigue up to your school rank. If you do,
            you may <strong>pull</strong> or <strong>push</strong>:
          </span>
        </p>
        <p>
          If you <strong>pull</strong>, choose a number of dice with non-blank
          results equal to the fatigue you received, and alter each to a blank
          result.
        </p>
        <p>
          If you <strong>push</strong>, choose a number of dice with blank
          results equal to the fatigue you received, and alter each to a
          non-blank result of your choice.
        </p>
        <p>{`[Celestial Realms, page 82]`}</p>
      </>
    ),
    image: ishikenImage,
    images: [
      { src: ishikenImage240, width: 240 },
      { src: ishikenImage, width: 468 },
    ],
  },
  wandering: {
    school: "The Wandering Blade",
    name: "Signature Weapon",
    effect: (
      <>
        <strong>{`The Wandering Blade`}</strong>
        <p>
          <span>
            {`Choose a signature weapon category (or unarmed) with GM approval. When using a weapon from this category for an Attack action or Performance check, roll one additional skill die. Additionally, when making such a check you may suffer fatigue up to your school rank to alter that many results of your kept dice to `}
            <Opportunity />
            {` results. [Path of Waves, page 48]`}
          </span>
        </p>
      </>
    ),
    image: wanderingImage,
    images: [
      { src: wanderingImage240, width: 240 },
      { src: wanderingImage, width: 1000 },
    ],
  },
};

export const longname = (key) => {
  if (!ABILITIES[key]) {
    return null;
  }

  const { name, school } = ABILITIES[key];
  return `${school} — ${name}`;
};

export default ABILITIES;
