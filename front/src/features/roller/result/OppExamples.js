import React from "react";
import { Opportunity } from "features/display/Symbol";
import { skillGroup } from "../data/approaches";
import ExternalLink from "features/navigation/ExternalLink";
import styles from "./OppExamples.module.less";
import { countDices } from "../utils";

const opportunities = [
  {
    text: `If you failed, determine the easiest way to accomplish the task you were attempting (skill and approach).`,
    count: 1,
    condition: ({ success }) => !success,
  },
  {
    text: `If you failed, provide assistance to the next character trying to accomplish the same action.`,
    count: 1,
    condition: ({ success }) => !success,
  },
  {
    text: (
      <>
        Remove 1 strife you gained from this check per <Opportunity /> spent
        this way.
      </>
    ),
    condition: ({ strifeCount }) => strifeCount > 0,
  },
  {
    text: `Provide assistance to the next character to attempt a check to accomplish something similar.`,
    count: 2,
    condition: ({ success }) => success,
  },
  {
    text: `Learn another character in the scene’s demeanor (if an NPC) and current strife.`,
    count: 1,
    condition: ({ ring }) => ring === "Air",
    extraLabel: `Air`,
  },
  {
    text: (
      <>
        Act subtly to attract minimal attention in your efforts. Extra{" "}
        <Opportunity /> makes the attempt even subtler.
      </>
    ),
    condition: ({ ring }) => ring === "Air",
    extraLabel: `Air`,
  },
  {
    text: `Notice an interesting detail about a character in the scene, such as an advantage or disadvantage. At the GM’s discretion, you may establish a new detail for an NPC.`,
    count: 2,
    condition: ({ ring }) => ring === "Air",
    extraLabel: `Air`,
  },
  {
    text: `Reassure another character in the scene with your presence, allowing them to remove 2 strife.`,
    count: 1,
    condition: ({ ring }) => ring === "Earth",
    extraLabel: `Earth`,
  },
  {
    text: (
      <>
        Act carefully to minimize consequences of failure or other dangers that
        could arise from the task. Extra <Opportunity /> makes the attempt even
        safer.
      </>
    ),
    condition: ({ ring }) => ring === "Earth",
    extraLabel: `Earth`,
  },
  {
    text: `Notice something missing or out of place in the vicinity that is not directly related to the task. At the GM’s discretion, you may establish an absence, such as a lack of shoes outside indicating the occupant’s absence.`,
    count: 2,
    condition: ({ ring }) => ring === "Earth",
    extraLabel: `Earth`,
  },
  {
    text: `Inflame another character in the scene with your presence, causing them to receive 2 strife.`,
    count: 1,
    condition: ({ ring }) => ring === "Fire",
    extraLabel: `Fire`,
  },
  {
    text: (
      <>
        Perform the task in a flashy way, drawing attention to yourself. Extra{" "}
        <Opportunity /> attracts even more notice.
      </>
    ),
    condition: ({ ring }) => ring === "Fire",
    extraLabel: `Fire`,
  },
  {
    text: `Notice something missing or out of place in the vicinity that is not directly related to the task. At the GM’s discretion, you may establish an absence, such as a lack of shoes outside indicating the occupant’s absence.`,
    count: 2,
    condition: ({ ring }) => ring === "Fire",
    extraLabel: `Fire`,
  },
  {
    text: `Remove 2 strife from yourself.`,
    count: 1,
    condition: ({ ring }) => ring === "Water",
    extraLabel: `Water`,
  },
  {
    text: (
      <>
        Perform the task efficiently, completing it more quickly or saving
        supplies. Extra <Opportunity /> further reduces the time or materials
        expended.
      </>
    ),
    condition: ({ ring }) => ring === "Water",
    extraLabel: `Water`,
  },
  {
    text: `Spot an interesting physical detail present in your environment not directly related to your check. At the GM’s discretion, you may establish a piece of terrain or a mundane object nearby.`,
    count: 2,
    condition: ({ ring }) => ring === "Water",
    extraLabel: `Water`,
  },
  {
    text: `Choose a ring other than Void. Reduce the TN of your next check by 1 if it uses that ring.`,
    count: 1,
    condition: ({ ring }) => ring === "Void",
    extraLabel: `Void`,
  },
  {
    text: (
      <>
        Feel a chill down your spine, notice a sudden silence, or detect another
        sign of the supernatural if there is a spiritual disturbance in the
        scene. Extra <Opportunity /> gives an increasingly precise location for
        the supernatural occurrence.
      </>
    ),
    condition: ({ ring }) => ring === "Void",
    extraLabel: `Void`,
  },
  {
    text: `Gain spiritual insight into the nature of the universe or your own heart. At the GM’s discretion, you may establish a fact about your character that has not been previously revealed but relates to the situation.`,
    count: 2,
    condition: ({ ring }) => ring === "Void",
    extraLabel: `Void`,
  },
  {
    text: `If you succeed, add the Resplendent or Subtle quality to an item that you are refining.`,
    count: 1,
    condition: ({ ring, skillGroup }) =>
      ring === "Air" && skillGroup === "Artisan",
    extraLabel: `Air, Artisan`,
  },
  {
    text: `Learn something about a character who created or used the item you are studying (such as one of their advantages or disadvantages of the GM’s choice that affected their creation or use of the item).`,
    count: 1,
    condition: ({ ring, skillGroup }) =>
      ring === "Air" && skillGroup === "Scholar",
    extraLabel: `Air, Scholar`,
  },
  {
    text: `Learn if the honor, glory, or status attribute of a character in the scene is higher, lower, or equal to yours.`,
    count: 1,
    condition: ({ ring, skillGroup }) =>
      ring === "Air" && skillGroup === "Social",
    extraLabel: `Air, Social`,
  },
  {
    text: `Convince a buyer to pay an additional 10% for an item you are selling.`,
    count: 1,
    condition: ({ ring, skillGroup }) =>
      ring === "Air" && skillGroup === "Trade",
    extraLabel: `Air, Trade`,
  },
  {
    text: `If you succeed, add the Durable quality to an item that you are restoring.`,
    count: 1,
    condition: ({ ring, skillGroup }) =>
      ring === "Earth" && skillGroup === "Artisan",
    extraLabel: `Earth, Artisan`,
  },
  {
    text: `Remember a place where you can research or study the topic you were attempting to recall.`,
    count: 1,
    condition: ({ ring, skillGroup }) =>
      ring === "Earth" && skillGroup === "Scholar",
    extraLabel: `Earth, Scholar`,
  },
  {
    text: `Increase the TN of the next Social check another character makes before the end of the scene by 1.`,
    count: 1,
    condition: ({ ring, skillGroup }) =>
      ring === "Earth" && skillGroup === "Social",
    extraLabel: `Earth, Social`,
  },
  {
    text: `Reduce the TN of the next check another character makes with the same skill before the end of the scene by 1.`,
    count: 1,
    condition: ({ ring, skillGroup }) =>
      ring === "Earth" && skillGroup === "Trade",
    extraLabel: `Earth, Trade`,
  },
  {
    text: `If you succeed, make one additional copy of the item you are creating.`,
    count: 1,
    condition: ({ ring, skillGroup }) =>
      ring === "Fire" && skillGroup === "Artisan",
    extraLabel: `Fire, Artisan`,
  },
  {
    text: `Extrapolate the motivations or desires of another character in the scene or wider situation.`,
    count: 1,
    condition: ({ ring, skillGroup }) =>
      ring === "Fire" && skillGroup === "Scholar",
    extraLabel: `Fire, Scholar`,
  },
  {
    text: `Reduce the TN of the next Social check another character makes before the end of the scene by 1.`,
    count: 1,
    condition: ({ ring, skillGroup }) =>
      ring === "Fire" && skillGroup === "Social",
    extraLabel: `Fire, Social`,
  },
  {
    text: (
      <>
        Unusual inspiration strikes; add a kept dice set to an <Opportunity />{" "}
        result to the next check you make with another skill.
      </>
    ),
    count: 1,
    condition: ({ ring, skillGroup }) =>
      ring === "Fire" && skillGroup === "Trade",
    extraLabel: `Fire, Trade`,
  },
  {
    text: (
      <>
        Add a kept dice set to an <Opportunity /> result to the next Artisan
        skill check you make before the end of the game session.
      </>
    ),
    count: 1,
    condition: ({ ring, skillGroup }) =>
      ring === "Water" && skillGroup === "Artisan",
    extraLabel: `Water, Artisan`,
  },
  {
    text: `Spot a unique or identifying quality, aspect, or ability of something that you are identifying.`,
    count: 1,
    condition: ({ ring, skillGroup }) =>
      ring === "Water" && skillGroup === "Scholar",
    extraLabel: `Water, Scholar`,
  },
  {
    text: (
      <>
        Add a kept dice set to an <Opportunity /> result to your next Social
        check before the end of the scene.
      </>
    ),
    count: 1,
    condition: ({ ring, skillGroup }) =>
      ring === "Water" && skillGroup === "Social",
    extraLabel: `Water, Social`,
  },
  {
    text: `Convince a seller to give you an additional 10% discount for an item you are buying.`,
    count: 1,
    condition: ({ ring, skillGroup }) =>
      ring === "Water" && skillGroup === "Trade",
    extraLabel: `Water, Trade`,
  },
  {
    text: `Reduce the TN of the next check you make using the item you are attuning yourself to by 1.`,
    count: 1,
    condition: ({ ring, skillGroup }) =>
      ring === "Void" && skillGroup === "Artisan",
    extraLabel: `Void, Artisan`,
  },
  {
    text: `Intuit whether you can learn anything of value from your current course of inquiry.`,
    count: 1,
    condition: ({ ring, skillGroup }) =>
      ring === "Void" && skillGroup === "Scholar",
    extraLabel: `Void, Scholar`,
  },
  {
    text: `Discern the objective of another character in the scene.`,
    count: 1,
    condition: ({ ring, skillGroup }) =>
      ring === "Void" && skillGroup === "Social",
    extraLabel: `Void, Social`,
  },
  {
    text: `Reduce any effect you have on your environment (and physical traces of your efforts) to a minimum.`,
    count: 1,
    condition: ({ ring, skillGroup }) =>
      ring === "Void" && skillGroup === "Trade",
    extraLabel: `Void, Trade`,
  },
  {
    text: (
      <>
        Add a kept dice set to an <Opportunity /> result to your next Martial
        skill check.
      </>
    ),
    count: 1,
    condition: ({ ring, skillGroup }) =>
      ring === "Air" && skillGroup === "Martial",
    extraLabel: `Air, Martial`,
  },
  {
    text: `Remove 1 fatigue.`,
    count: 1,
    condition: ({ ring, skillGroup }) =>
      ring === "Water" && skillGroup === "Martial",
    extraLabel: `Water, Martial`,
  },
];

const HowMany = ({ count }) => {
  if (!count) {
    return (
      <>
        <Opportunity />
        {`+: `}
      </>
    );
  }

  return (
    <>
      {[...Array(count)].map((_, index) => {
        return (
          <React.Fragment key={index.toString()}>
            <Opportunity />
            {index + 1 < count ? ` ` : `: `}
          </React.Fragment>
        );
      })}
    </>
  );
};

const OppExamples = ({ approach, dices, tn }) => {
  if (!approach) {
    return null;
  }

  const { opportunityCount, strifeCount, successCount } = countDices(
    dices.filter(({ status }) => status === "kept")
  );

  if (opportunityCount === 0) {
    return null;
  }

  const [ring, skill] = approach.split("|");

  const success = !!tn && successCount >= tn;

  return (
    <div className={styles.container}>
      <p>
        Here <em>some</em> examples of uses of <Opportunity /> for a{" "}
        <strong>
          {skill} ({ring})
        </strong>{" "}
        roll.
        <br />
        More examples can be found in the Core book (pages 328-329), in the
        various other books or{" "}
        <ExternalLink href="https://craneclan.weebly.com/5th-edition-opportunity-table.html">
          here
        </ExternalLink>
        .
      </p>
      <ul>
        {opportunities.map(({ text, count, condition, extraLabel }, index) => {
          if (
            condition &&
            !condition({
              ring,
              skill,
              skillGroup: skillGroup(skill),
              strifeCount,
              success,
            })
          ) {
            return null;
          }

          if (count > opportunityCount) {
            return null;
          }

          return (
            <li key={index.toString()}>
              {extraLabel && `(${extraLabel}) `}
              <HowMany count={count} />
              {text}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default OppExamples;
