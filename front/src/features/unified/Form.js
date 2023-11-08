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

const Form = ({
  rollType,
  setError,
  setLoading,
  setId,
  setBbMessage,
  setResult,
  ...otherParams
}) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const updateResult = (
    result,
    { id, campaign, character, bbMessage } = {}
  ) => {
    setResult(result);
    setId(id);
    setBbMessage(bbMessage);
    dispatch(addCampaign(campaign));
    dispatch(addCharacter(character));
    setError(false);
    setLoading(false);
  };

  const clearResult = useCallback(() => {
    setResult(undefined);
    setId(undefined);
    setBbMessage(undefined);
  }, [setResult, setId, setBbMessage]);

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

  const params = {
    setLoading,
    ajaxError,
    updateResult,
    clearResult,
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
