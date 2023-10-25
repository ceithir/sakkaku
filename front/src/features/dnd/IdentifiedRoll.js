import React from "react";
import Layout from "./Layout";
import TextResult from "./TextResult";
import ResultBox from "components/aftermath/ResultBox";
import { stringify } from "./formula";

export const link = (id) => !!id && `${window.location.origin}/r/${id}`;
export const bbMessage = ({ description, total, parameters }) =>
  `${description} | ${stringify(parameters)} ⇒ [b]${total}[/b]`;

const D10IdentifiedRoll = ({
  id,
  character,
  campaign,
  player,
  description,
  roll,
  result,
}) => {
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
