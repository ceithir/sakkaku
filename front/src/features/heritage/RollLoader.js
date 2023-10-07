import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOnServer } from "../../server";
import DefaultErrorMessage from "../../DefaultErrorMessage";
import Loader from "../navigation/Loader";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../user/reducer";
import {
  selectLoading,
  selectError,
  setLoading,
  setError,
  load,
} from "./reducer";
import StaticRoll from "./StaticRoll";
import Roll from "./Roll";

const isOngoingRollOfCurrentUser = ({ data, user }) => {
  return (
    data &&
    user &&
    data.user &&
    user.id === data.user.id &&
    data.roll.dices.some(({ status }) => status === "pending")
  );
};

const RollLoader = () => {
  const { uuid } = useParams();
  const user = useSelector(selectUser);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const dispatch = useDispatch();

  const [data, setData] = useState();

  useEffect(() => {
    dispatch(setLoading(true));
    getOnServer({
      uri: `/public/ffg/l5r/heritage-rolls/${uuid}`,
      success: (data) => {
        setData(data);
        dispatch(setLoading(false));
      },
      error: () => {
        dispatch(setLoading(false));
        dispatch(setError(true));
      },
    });
  }, [uuid, dispatch]);

  useEffect(() => {
    if (!data) {
      return;
    }
    if (isOngoingRollOfCurrentUser({ data, user })) {
      const {
        uuid,
        roll: { dices, metadata },
        ...context
      } = data;
      dispatch(
        load({
          uuid,
          dices: dices,
          metadata: metadata,
          context,
        })
      );
    }
  }, [data, user, dispatch]);

  if (!data) {
    if (loading) {
      return <Loader />;
    }

    if (error) {
      return <DefaultErrorMessage />;
    }

    return null;
  }

  if (isOngoingRollOfCurrentUser({ user, data })) {
    return <Roll />;
  }

  const { roll } = data;

  return <StaticRoll roll={roll} context={data} />;
};

export default RollLoader;
