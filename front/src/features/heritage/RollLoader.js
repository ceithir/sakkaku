import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../user/reducer";
import { load } from "./reducer";
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

const RollLoader = (data) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!data) {
      return;
    }
    if (isOngoingRollOfCurrentUser({ data, user })) {
      const {
        id,
        roll: { dices, metadata },
        ...context
      } = data;
      dispatch(
        load({
          id,
          dices: dices,
          metadata: metadata,
          context,
        })
      );
    }
  }, [data, user, dispatch]);

  if (isOngoingRollOfCurrentUser({ user, data })) {
    return <Roll />;
  }

  const { roll } = data;

  return <StaticRoll roll={roll} context={data} />;
};

export default RollLoader;
