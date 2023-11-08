import { useState } from "react";
import styles from "./Roller.module.less";
import Result from "./Result";
import Form from "./Form";
import DefaultErrorMessage from "DefaultErrorMessage";
import Selector from "./Selector";

const Roller = ({ rollType }) => {
  const [bbMessage, setBbMessage] = useState();
  const [id, setId] = useState();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();
  const [error, setError] = useState(false);

  if (error) {
    return <DefaultErrorMessage />;
  }

  return (
    <div className={styles.layout}>
      <Selector />
      <div className={styles.content}>
        <Form
          rollType={rollType}
          setBbMessage={setBbMessage}
          setId={setId}
          loading={loading}
          setLoading={setLoading}
          setResult={setResult}
          setError={setError}
        />
        <Result
          bbMessage={bbMessage}
          id={id}
          loading={loading}
          result={result}
        />
      </div>
    </div>
  );
};

export default Roller;
