import { useState, useCallback } from "react";
import styles from "./Roller.module.less";
import Result from "./Result";
import Form from "./Form";
import DefaultErrorMessage from "DefaultErrorMessage";
import Selector from "./Selector";
import PreviousResults from "./PreviousResults";
import CopyAllButton from "./CopyAllButton";
import { Button } from "antd";

const Roller = ({ rollType }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();
  const [error, setError] = useState(false);
  const [resultHistory, setResultHistory] = useState([]);

  const setR = useCallback(
    (data) => {
      setResult(data);
      if (!!data?.id) {
        setResultHistory((previous) => [...previous, data]);
      }
    },
    [setResult, setResultHistory]
  );

  const previousResults = (() => {
    if (!!result) {
      return resultHistory.filter(({ id }) => id !== result.id);
    }
    return resultHistory;
  })();

  if (error) {
    return <DefaultErrorMessage />;
  }

  return (
    <div className={styles.layout}>
      <Selector />
      <div className={styles.content}>
        <Form
          rollType={rollType}
          loading={loading}
          setLoading={setLoading}
          setResult={setR}
          setError={setError}
        />
        <Result loading={loading} result={result} />
        {previousResults.length > 0 && (
          <>
            <div className={styles.buttons}>
              <CopyAllButton results={resultHistory} />
              <Button
                onClick={() => setResultHistory([])}
              >{`Clear history`}</Button>
            </div>
            <PreviousResults results={previousResults} />
          </>
        )}
      </div>
    </div>
  );
};

export default Roller;
