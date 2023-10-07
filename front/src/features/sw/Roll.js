import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DefaultErrorMessage from "DefaultErrorMessage";
import { getOnServer } from "server";
import Loader from "features/navigation/Loader";
import Layout from "./Layout";
import ResultBox from "components/aftermath/ResultBox";
import Result from "./Result";
import { diceToImageSrc } from "./ImageDie";
import { isAForceRoll, netSuccesses, netAdvantages, sortDice } from "./Result";

export const link = (id) =>
  !!id && `${window.location.origin}/ffg-sw-rolls/${id}`;
export const bbMessage = ({ id, description, dice, parameters, result }) =>
  `${description}[/url]` +
  "\n" +
  `[url=${link(id)}]${sortDice(dice)
    .map(
      (dice) => `[img]${window.location.origin}${diceToImageSrc(dice)}[/img]`
    )
    .join(" ")}` +
  (!isAForceRoll(parameters)
    ? `[/url]\n[url=${link(id)}]Net Successes: [b]${netSuccesses(
        result
      )}[/b]; Net Advantages: ${netAdvantages(result)}`
    : "");

const Roll = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    setLoading(true);
    getOnServer({
      uri: `/public/ffg/sw/rolls/${id}`,
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

  const { character, campaign, user: player, description, roll, result } = data;

  const identity = { character, campaign, player };
  const rollSpecificData = [].filter(Boolean);
  const { parameters, dice } = roll;

  return (
    <Layout>
      <ResultBox
        identity={identity}
        description={description}
        rollSpecificData={rollSpecificData}
        link={link(id)}
        bbMessage={bbMessage({ id, description, dice, parameters, result })}
      >
        <Result parameters={parameters} dice={dice} />
      </ResultBox>
    </Layout>
  );
};

export default Roll;
