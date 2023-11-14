import { useRef, useEffect } from "react";
import styles from "./Result.module.less";
import Loader from "features/navigation/Loader";
import { Link } from "react-router-dom";
import CopyButtons from "components/aftermath/CopyButtons";

export const Actions = ({ id, bbMessage }) => {
  if (!id) {
    return null;
  }

  return (
    <div className={styles.buttons}>
      <>
        <CopyButtons
          link={`${window.location.origin}/r/${id}`}
          bbMessage={bbMessage}
        />
        <Link to={`/r/${id}`}>{`Go to page`}</Link>
      </>
    </div>
  );
};

const Result = ({ id, bbMessage, content }) => {
  return (
    <div className={styles.result}>
      <>{content}</>
      <Actions id={id} bbMessage={bbMessage} />
    </div>
  );
};

const ScrollToResult = (params) => {
  const refContainer = useRef();

  useEffect(() => {
    document.querySelector(":focus")?.blur();
    refContainer?.current?.scrollIntoView({ behavior: "smooth" });
  }, [refContainer]);

  return (
    <div ref={refContainer}>
      <Result {...params} />
    </div>
  );
};

const ResultWrapper = ({ result, loading }) => {
  if (loading) {
    return <Loader />;
  }

  if (!result) {
    return null;
  }

  return <ScrollToResult {...result} />;
};

export default ResultWrapper;
