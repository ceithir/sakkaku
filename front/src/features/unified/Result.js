import { useRef, useEffect } from "react";
import styles from "./Result.module.less";
import Loader from "features/navigation/Loader";
import { Link } from "react-router-dom";
import CopyButtons from "components/aftermath/CopyButtons";

const Result = ({ id, bbMessage, content }) => {
  return (
    <div className={styles.result}>
      <>{content}</>
      {!!id && (
        <div className={styles.buttons}>
          <>
            <CopyButtons
              link={`${window.location.origin}/r/${id}`}
              bbMessage={bbMessage}
            />
            <Link to={`/r/${id}`}>{`Go to page`}</Link>
          </>
        </div>
      )}
    </div>
  );
};

const ScrollToResult = ({ result }) => {
  const refContainer = useRef();

  useEffect(() => {
    document.querySelector(":focus")?.blur();
    refContainer?.current?.scrollIntoView({ behavior: "smooth" });
  }, [refContainer]);

  const results = Array.isArray(result) ? result : [result];

  return (
    <div ref={refContainer}>
      {results.map((params, index) => {
        return <Result key={index.toString()} {...params} />;
      })}
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

  return <ScrollToResult result={result} />;
};

export default ResultWrapper;
