import { useRef, useEffect } from "react";
import styles from "./Result.module.less";
import Loader from "features/navigation/Loader";
import { Link } from "react-router-dom";
import CopyButtons from "components/aftermath/CopyButtons";

const Result = ({ id, bbMessage, result }) => {
  return (
    <div className={styles.result}>
      <>{result}</>
      <div className={styles.buttons}>
        {!!id && (
          <>
            <CopyButtons
              link={`${window.location.origin}/r/${id}`}
              bbMessage={bbMessage}
            />
            <Link to={`/r/${id}`}>{`Go to page`}</Link>
          </>
        )}
      </div>
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

const ResultWrapper = ({ result, loading, id, bbMessage }) => {
  if (loading) {
    return <Loader />;
  }

  if (!result) {
    return null;
  }

  return <ScrollToResult result={result} id={id} bbMessage={bbMessage} />;
};

export default ResultWrapper;
