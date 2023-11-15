import DnDRoller from "features/dnd/Roller";
import StarWarsFFGRoller from "features/sw/Roller";
import CyberpunkRoller from "features/cyberpunk/Roller";
import L5RAEG from "features/d10/D10Roller";
import {
  setShowReconnectionModal,
  addCampaign,
  addCharacter,
} from "features/user/reducer";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useEffect, useCallback } from "react";
import { postOnServer, authentifiedPostOnServer } from "server";

const standardizedPostOnServer = ({
  uri,
  parameters,
  metadata,
  success,
  error,
  userData,
}) => {
  const { campaign, character, description, testMode } = userData;

  if (testMode || !campaign || !character) {
    postOnServer({
      uri: `/public${uri}`,
      body: {
        parameters,
        metadata,
      },
      success,
      error,
    });
  } else {
    authentifiedPostOnServer({
      uri,
      body: {
        parameters,
        campaign,
        character,
        description,
        metadata,
      },
      success,
      error,
    });
  }
};

const Form = ({
  rollType,
  setError,
  setLoading,
  setResult,
  ...otherParams
}) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const updateResult = ({
    content,
    id,
    campaign,
    character,
    bbMessage,
    description,
  }) => {
    setResult({ content, id, bbMessage, description });
    dispatch(addCampaign(campaign));
    dispatch(addCharacter(character));
    setError(false);
    setLoading(false);
  };

  const clearResult = useCallback(() => {
    setResult(undefined);
  }, [setResult]);

  useEffect(() => {
    clearResult();
  }, [location, clearResult]);

  const ajaxError = (err) => {
    if (err.message === "Authentication issue") {
      dispatch(setShowReconnectionModal(true));
    } else {
      console.error(err);
      setError(true);
    }
    setLoading(false);
  };

  const createRoll = ({
    uri,
    parameters,
    userData = {},
    metadata = {},
    result,
  }) => {
    standardizedPostOnServer({
      uri,
      parameters,
      metadata,
      success: (data) => {
        const { id, character, campaign, description } = data;
        updateResult({
          id,
          character,
          campaign,
          description,
          ...result(data),
        });
      },
      error: ajaxError,
      userData,
    });
  };

  const params = {
    setLoading,
    ajaxError,
    updateResult,
    clearResult,
    createRoll,
    ...otherParams,
  };

  switch (rollType) {
    case "DnD":
      return <DnDRoller {...params} />;
    case "FFG-SW":
      return <StarWarsFFGRoller {...params} />;
    case "Cyberpunk-RED":
      return <CyberpunkRoller {...params} />;
    case "AEG-L5R":
      return <L5RAEG {...params} />;
    default:
      return null;
  }
};

export default Form;
