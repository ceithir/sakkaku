import ResultBox from "components/aftermath/ResultBox";
import Layout from "./Layout";
import TextResult from "./TextResult";
import styles from "./Roll.module.less";

export const link = (id) => !!id && `${window.location.origin}/r/${id}`;
export const bbMessage = ({ description, total, parameters }) => {
  const textModifier = () => {
    const { modifier } = parameters;
    if (!modifier) {
      return "";
    }
    if (modifier < 0) {
      return modifier;
    }
    return `+${modifier}`;
  };

  return `${description} | "1d10"${textModifier()} ⇒ [b]${total}[/b]`;
};

const Roll = ({
  id,
  character,
  campaign,
  player,
  description,
  roll,
  result,
}) => {
  const tn = roll.parameters.tn;
  const rollSpecificData = [
    !!tn && {
      label: `TN`,
      content: tn,
    },
  ].filter(Boolean);

  return (
    <Layout>
      <ResultBox
        identity={{ character, campaign, player }}
        description={description}
        link={link(id)}
        bbMessage={bbMessage({
          description,
          total: result.total,
          parameters: roll.parameters,
        })}
        rollSpecificData={rollSpecificData}
      >
        <div className={styles.result}>
          <TextResult {...roll} />
        </div>
      </ResultBox>
    </Layout>
  );
};

export default Roll;
