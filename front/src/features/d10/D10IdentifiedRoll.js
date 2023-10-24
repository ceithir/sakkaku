import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DefaultErrorMessage from "DefaultErrorMessage";
import { getOnServer } from "server";
import Loader from "features/navigation/Loader";
import RollResult from "./RollResult";
import CharacterSheet from "features/display/CharacterSheet";
import styles from "./D10IdentifiedRoll.module.less";
import Title from "./Title";
import Description from "features/trinket/Description";
import { stringify } from "./formula";
import CopyButtons from "components/aftermath/CopyButtons";
import { Helmet } from "react-helmet";

export const link = (id) => !!id && `${window.location.origin}/d10-rolls/${id}`;
export const bbMessage = ({ description, roll }) => {
  const { parameters, dice } = roll;
  const { tn } = parameters;
  const total =
    dice
      .filter(({ status }) => status === "kept")
      .reduce((acc, { value }) => acc + value, 0) + (parameters.modifier || 0);

  return (
    `${description} | ${stringify(parameters)} ⇒ [b]${total}[/b]` +
    (!!tn ? ` (TN: ${tn})` : "")
  );
};

const rollSummary = (roll) => {
  const { parameters, dice } = roll;
  const { tn } = parameters;
  const total =
    dice
      .filter(({ status }) => status === "kept")
      .reduce((acc, { value }) => acc + value, 0) + (parameters.modifier || 0);

  return `${stringify(parameters)} ⇒ ${total}` + (!!tn ? ` (TN: ${tn})` : "");
};

const D10IdentifiedRoll = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    setLoading(true);
    getOnServer({
      uri: `/public/aeg/l5r/rolls/${id}`,
      success: (data) => {
        setData(data);
        setLoading(false);
      },
      error: () => {
        setError(true);
        setLoading(false);
      },
    });
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <DefaultErrorMessage />;
  }

  if (!data) {
    return null;
  }

  const { character, campaign, user: player, description, roll } = data;
  const { dice, parameters, metadata } = roll;
  // Legacy (no more way to specify raises as of now)
  const { raises = {} } = metadata;
  const { called = 0, free = 0, burnt = 0 } = raises;
  const { tn } = parameters;
  const originalTn = tn && tn - called * 5 + burnt * 5;

  const organizedData = [
    { label: `Description`, content: <Description>{description}</Description> },
    !!tn && {
      label: `TN`,
      content:
        tn !== originalTn
          ? `${originalTn}${called > 0 ? `+${called}x5` : ""}${
              burnt > 0 ? `-${burnt}x5` : ""
            } → ${tn}`
          : tn,
    },
    !!metadata.original && {
      label: `Input`,
      content: metadata.original,
    },
    !!parameters.explosions?.length && {
      label: `Explode on`,
      content: parameters.explosions.join(", "),
    },
    !!parameters.rerolls?.length && {
      label: `Reroll once on`,
      content: parameters.rerolls.join(", "),
    },
    !!metadata.voided &&
      metadata.voided !== "none" && {
        label: `Void Point Effect`,
        content: metadata.voided === "skill" ? `Phantom rank` : `+1k1`,
      },
    called + free > 0 && {
      label: `Raises`,
      content: (
        <>
          {`${called} Called, ${free} Free (${burnt} spent to reduce TN), Total: `}
          <strong>{called + free - burnt}</strong>
        </>
      ),
    },
    {
      label: `Roll`,
      content: <RollResult dice={dice} parameters={parameters} />,
    },
  ].filter(Boolean);

  return (
    <>
      <div className={styles.background}>
        <Title />
        <div className={styles.container}>
          <div className={styles.context}>
            <CharacterSheet
              identity={{ character, campaign, player }}
              data={organizedData}
            />
          </div>

          <div className={styles.buttons}>
            <CopyButtons
              link={link(id)}
              bbMessage={bbMessage({ description, roll })}
            />
          </div>
        </div>
      </div>
      <Helmet>
        <meta property="og:title" content={`Sakkaku – ${campaign}`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`https://sakkaku.org/logo.png`} />
        <meta property="og:description" content={rollSummary(roll)} />
      </Helmet>
    </>
  );
};

export default D10IdentifiedRoll;
