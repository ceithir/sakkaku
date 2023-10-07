import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOnServer } from "../../server";
import DefaultErrorMessage from "../../DefaultErrorMessage";
import Complete from "./Complete";
import Summary from "./Summary";
import DicesBox from "./DicesBox";
import Roller from "./index";
import Loader from "../navigation/Loader";
import { useSelector } from "react-redux";
import { selectUser } from "../user/reducer";
import { orderDices } from "./utils";
import styles from "./IdentifiedRoll.module.less";
import Layout from "./Layout";

const IdentifiedRoll = () => {
  const { id } = useParams();
  const user = useSelector(selectUser);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    setLoading(true);
    getOnServer({
      uri: `/public/ffg/l5r/rolls/${id}`,
      success: (data) => {
        setData(data);
        setLoading(false);
      },
      error: (_) => {
        setLoading(false);
        setError(true);
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

  const { roll, user: player, result } = data;
  const { dices, parameters, metadata } = roll;

  if (!result && !!user && !!player && user.id === player.id) {
    return <Roller save={data} />;
  }

  if (!result) {
    return (
      <Layout>
        <div className={styles.ongoing}>
          <Summary
            player={player}
            {...data}
            {...parameters}
            metadata={metadata}
          />
          <DicesBox
            text={`Check in progress. Current dice pool:`}
            dices={orderDices(
              dices.filter(({ status }) => ["pending", "kept"].includes(status))
            )}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Complete
        dices={dices}
        intent={parameters}
        context={data}
        player={player}
        metadata={metadata}
      />
    </Layout>
  );
};

export default IdentifiedRoll;
