import DnDRoller from "features/dnd/Roller";
import StarWarsFFGRoller from "features/sw/Roller";
import CyberpunkRoller from "features/cyberpunk/Roller";

const Form = ({ rollType, ...params }) => {
  if (rollType === "DnD") {
  }
  switch (rollType) {
    case "DnD":
      return <DnDRoller {...params} />;
    case "FFG-SW":
      return <StarWarsFFGRoller {...params} />;
    case "Cyberpunk-RED":
      return <CyberpunkRoller {...params} />;
    default:
      return null;
  }
};

export default Form;
