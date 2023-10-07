import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DefaultErrorMessage from "DefaultErrorMessage";
import { getOnServer } from "server";
import Loader from "features/navigation/Loader";
import ResultBox from "components/aftermath/ResultBox";
import Layout from "./Layout";
import Card from "./Card";
import styles from "./IdDraw.module.less";
import { imgSrc } from "./Card";
import SmallDeck from "./SmallDeck";

export const link = (id) => !!id && `${window.location.origin}/draws/${id}`;
export const bbMessage = ({ description, hand, id }) =>
  `${description}[/url]` +
  "\n" +
  `[url=${link(id)}]${hand
    .map((number) => `[img]${window.location.origin}${imgSrc(number)}[/img]`)
    .join(" ")}`;

const IdDraw = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    setLoading(true);
    getOnServer({
      uri: `/public/cards/draws/${id}`,
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

  const { character, campaign, user: player, description } = data;

  const {
    roll: {
      parameters: { deck },
      hand,
    },
  } = data;

  const rollSpecificData = [
    {
      label: `Deck before draw`,
      content: <SmallDeck cards={deck} />,
    },
  ];

  return (
    <Layout>
      <ResultBox
        identity={{ character, campaign, player }}
        description={description}
        rollSpecificData={rollSpecificData}
        link={link(id)}
        bbMessage={bbMessage({
          id,
          description,
          hand,
        })}
      >
        <div className={styles.cards}>
          {hand.map((number, index) => {
            return <Card key={index.toString()} number={number} />;
          })}
        </div>
      </ResultBox>
    </Layout>
  );
};

export default IdDraw;
