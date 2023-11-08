import DnDRoller from "features/dnd/Roller";
import StarWarsFFGRoller from "features/sw/Roller";
import CyberpunkRoller from "features/cyberpunk/Roller";
import L5RAEG from "features/d10/D10Roller";

const Form = ({ rollType, ...params }) => {
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
