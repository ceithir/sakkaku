import DnDRoller from "features/dnd/Roller";
import StarWarsFFGRoller from "features/sw/Roller";
import CyberpunkRoller from "features/cyberpunk/Roller";
import L5RAEG from "features/d10/D10Roller";
import { setShowReconnectionModal } from "features/user/reducer";
import { useDispatch } from "react-redux";

const Form = ({ rollType, setError, setLoading, ...otherParams }) => {
  const dispatch = useDispatch();

  const ajaxError = (err) => {
    if (err.message === "Authentication issue") {
      dispatch(setShowReconnectionModal(true));
    } else {
      setError(true);
    }
    setLoading(false);
  };

  const params = {
    setLoading,
    ajaxError,
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
