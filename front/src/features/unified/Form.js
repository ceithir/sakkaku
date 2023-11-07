import DnDRoller from "features/dnd/Roller";
import StarWarsFFGRoller from "features/sw/Roller";

const Form = ({ rollType, ...params }) => {
  if (rollType === "DnD") {
  }
  switch (rollType) {
    case "DnD":
      return <DnDRoller {...params} />;
    case "FFG-SW":
      return <StarWarsFFGRoller {...params} />;
    default:
      return null;
  }
};

export default Form;
