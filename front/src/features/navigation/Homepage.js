import React from "react";
import { Typography } from "antd";
import { Link as InternalLink } from "react-router-dom";
import styles from "./Homepage.module.less";
import MainTitle from "../display/Title";
import ExternalLink from "./ExternalLink";

const { Title } = Typography;

const Link = ({ uri, children }) => {
  if (uri.startsWith("/")) {
    return <InternalLink to={uri}>{children}</InternalLink>;
  }

  return <ExternalLink href={uri}>{children}</ExternalLink>;
};

const Section = ({ title, text, links = [] }) => {
  const slug = title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

  return (
    <div className={styles.section}>
      <Title level={2} id={slug}>
        {title}
        <a href={`#${slug}`} className={styles.anchor}>{`#`}</a>
      </Title>
      <div className={styles.content}>
        {text}
        {links.length > 0 && (
          <div className={styles.links}>
            {links.map(({ uri, label, description }) => {
              return (
                <div key={uri}>
                  <Link uri={uri}>{label}</Link>
                  <div>{description}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const Homepage = () => {
  return (
    <div className={styles.container}>
      <MainTitle>{`Sakkaku`}</MainTitle>
      <Section
        title={`Dice rollers`}
        text={
          <>
            <p>
              {`Sakkaku aims to provide dice rollers for various roleplaying games that are easy to use and, most importantly, that don't require any installation or setup.`}
            </p>
            <p>{`As of now, the following types of rolls are supported:`}</p>
          </>
        }
        links={[
          {
            uri: "/roll-dnd",
            label: `Classic (d6, d20, d4, d12…)`,
            description: `For the most common needs, like rolling 2d6, 1d20+3, 1d12+1d4, etc.`,
          },
          {
            uri: "/roll-d10",
            label: `L5R ‒ AEG Roll & Keep (d10)`,
            description: (
              <>
                {`The easiest way (available here) to roll dice for the `}
                <em>{`Legend of the Five Rings`}</em>
                {` (AEG d10 version) thanks to preconfigured explosions and the like.`}
              </>
            ),
          },
          {
            uri: "/roll",
            label: `L5R ‒ FFG Roll & Keep (custom dice)`,
            description: (
              <>
                {`Support for the custom dice of the `}
                <em>{`Legend of the Five Rings`}</em>
                {` (FFG version). Also offers many quality-of-life features and tools to alleviate some of the complexity of this system.`}
              </>
            ),
          },
          {
            uri: "/roll-ffg-sw",
            label: `Star Wars ‒ FFG`,
            description: (
              <>
                {`Support for the custom dice of the `}
                <em>{`Star Wars`}</em>
                {` roleplaying game (FFG version).`}
              </>
            ),
          },
        ]}
      />
      <Section
        title={`Play-by-post`}
        text={
          <>
            <p>
              {`Sakkaku was first and foremost designed with play-by-post in mind, as a complement to `}
              <ExternalLink
                href={"https://orokos.com/"}
              >{`Orokos`}</ExternalLink>
              {`.`}
            </p>
            <p>{`Thus, while logged in, you can permanently save any roll you trigger into Sakkaku's database. Such a roll can then be shared freely on your play-by-post platform of choice (forum, Discord…).`}</p>
            <p>{`Note that all rolls persisted on Sakkaku can be accessed publicly. For easier bookkeeping on all sides, some context information (campaign name, what the roll is for, etc.) might be requested.`}</p>
          </>
        }
        links={[
          {
            uri: "/rolls",
            label: `Saved rolls`,
            description: `Every roll registered on the site since its inception.`,
          },
        ]}
      />
    </div>
  );
};

export default Homepage;
