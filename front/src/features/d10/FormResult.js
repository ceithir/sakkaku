import React, { useRef, useEffect } from "react";
import styles from "./FormResult.module.less";
import RollResult from "./RollResult";
import Loader from "features/navigation/Loader";
import { Link } from "react-router-dom";
import CopyButtons from "components/aftermath/CopyButtons";
import { link, bbMessage } from "./D10IdentifiedRoll";

const ScrollForm = ({ result, context }) => {
  const refContainer = useRef();

  useEffect(() => {
    document.querySelector(":focus")?.blur();
    refContainer?.current?.scrollIntoView({ behavior: "smooth" });
  }, [refContainer]);

  return (
    <div className={styles.result} ref={refContainer}>
      <RollResult {...result} />
      <div className={styles.buttons}>
        <CopyButtons
          link={link(context?.id)}
          bbMessage={bbMessage({
            description: context?.description,
            roll: result,
          })}
        />
        {!!context?.id && <Link to={`/r/${context.id}`}>{`Go to page`}</Link>}
      </div>
    </div>
  );
};

const FormResult = ({ result, context, loading }) => {
  if (loading) {
    return <Loader />;
  }

  if (!result) {
    return null;
  }

  return <ScrollForm result={result} context={context} />;
};

export default FormResult;
