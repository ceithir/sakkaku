import { useState } from "react";
import styles from "./Roller.module.less";
import Result from "./Result";
import Form from "./Form";
import DefaultErrorMessage from "DefaultErrorMessage";

const Roller = () => {
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
      <Form
        setBbMessage={setBbMessage}
        setId={setId}
        loading={loading}
        setLoading={setLoading}
        setResult={setResult}
        setError={setError}
      />
      <Result bbMessage={bbMessage} id={id} loading={loading} result={result} />
    </div>
  );
};

export default Roller;
