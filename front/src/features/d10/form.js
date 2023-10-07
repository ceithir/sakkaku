import { parse, cap } from "./formula";
import { postOnServer, authentifiedPostOnServer } from "server";
import {
  addCampaign,
  addCharacter,
  setShowReconnectionModal,
} from "features/user/reducer";

export const prepareFinish =
  ({ setLoading, setResult, setContext, setError, dispatch, user }) =>
  ({
    formula,
    tn,
    explosions,
    rerolls,
    select,
    campaign,
    character,
    description,
    testMode,
    metadata = {},
  }) => {
    setLoading(true);
    setResult(undefined);
    setContext(undefined);

    const parameters = {
      ...cap(parse(formula)),
      tn,
      explosions,
      rerolls,
      select,
    };
    const error = (err) => {
      if (err.message === "Authentication issue") {
        dispatch(setShowReconnectionModal(true));
      } else {
        setError(true);
      }
      setLoading(false);
    };

    if (!user || testMode) {
      postOnServer({
        uri: "/public/aeg/l5r/rolls/create",
        body: {
          parameters,
          metadata,
        },
        success: (data) => {
          setResult(data);
          setLoading(false);
        },
        error,
      });
      return;
    }

    authentifiedPostOnServer({
      uri: "/aeg/l5r/rolls/create",
      body: {
        parameters,
        campaign,
        character,
        description,
        metadata,
      },
      success: ({ roll, ...context }) => {
        setResult(roll);
        setContext(context);
        setLoading(false);
      },
      error,
    });

    dispatch(addCampaign(campaign));
    dispatch(addCharacter(character));
  };
