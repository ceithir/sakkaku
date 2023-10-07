import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DefaultErrorMessage from "DefaultErrorMessage";
import { getOnServer } from "server";
import Loader from "features/navigation/Loader";
import ResultBox from "components/aftermath/ResultBox";
import Layout from "./Layout";
import TextResult from "./TextResult";
import styles from "./Roll.module.less";

export const link = (id) =>
  !!id && `${window.location.origin}/cyberpunk/rolls/${id}`;
export const bbMessage = ({ description, total, parameters }) => {
  const textModifier = () => {
    const { modifier } = parameters;
    if (!modifier) {
      return "";
    }
    if (modifier < 0) {
      return modifier;
    }
    return `+${modifier}`;
  };

  return `${description} | "1d10"${textModifier()} ⇒ [b]${total}[/b]`;
};

const Roll = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    setLoading(true);
    getOnServer({
      uri: `/public/cyberpunk/rolls/${id}`,
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

  const tn = roll.parameters.tn;
  const rollSpecificData = [
    !!tn && {
      label: `TN`,
      content: tn,
    },
  ].filter(Boolean);

  return (
    <Layout>
      <ResultBox
        identity={{ character, campaign, player }}
        description={description}
        link={link(id)}
        bbMessage={bbMessage({
          description,
          total: result.total,
          parameters: roll.parameters,
        })}
        rollSpecificData={rollSpecificData}
      >
        <div className={styles.result}>
          <TextResult {...roll} />
        </div>
      </ResultBox>
    </Layout>
  );
};

export default Roll;
