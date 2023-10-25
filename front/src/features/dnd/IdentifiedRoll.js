import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DefaultErrorMessage from "DefaultErrorMessage";
import { getOnServer } from "server";
import Loader from "features/navigation/Loader";
import Layout from "./Layout";
import TextResult from "./TextResult";
import ResultBox from "components/aftermath/ResultBox";
import { stringify } from "./formula";

export const link = (id) => !!id && `${window.location.origin}/dnd-rolls/${id}`;
export const bbMessage = ({ description, total, parameters }) =>
  `${description} | ${stringify(parameters)} ⇒ [b]${total}[/b]`;

const D10IdentifiedRoll = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    setLoading(true);
    getOnServer({
      uri: `/rolls/${id}`,
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
  const { parameters, metadata } = roll;
  const { tn } = parameters;

  const rollSpecificData = [
    !!tn && {
      label: `TN`,
      content: tn,
    },
    !!metadata.original && {
      label: `Input`,
      content: metadata.original,
    },
    {
      label: `Result`,
      content: <TextResult {...roll} />,
    },
  ].filter(Boolean);

  return (
    <Layout>
      <ResultBox
        identity={{ character, campaign, player }}
        description={description}
        rollSpecificData={rollSpecificData}
        link={link(id)}
        bbMessage={bbMessage({
          description,
          total: result.total,
          parameters,
        })}
      />
    </Layout>
  );
};

export default D10IdentifiedRoll;
