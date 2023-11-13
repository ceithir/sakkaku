import styles from "./PreviousResults.module.less";
import { Actions } from "./Result";

const PreviousResults = ({ results }) => {
  return (
    <div>
      <h4 className={styles.title}>{`Previously`}</h4>
      {[...results].reverse().map(({ id, description, content, bbMessage }) => {
        return (
          <div key={id.toString()} className={styles.result}>
            <p>{description}</p>
            <div className={styles.core}>{content}</div>
            <Actions id={id} bbMessage={bbMessage} />
          </div>
        );
      })}
    </div>
  );
};

export default PreviousResults;
