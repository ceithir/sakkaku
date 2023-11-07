import { useEffect, useState } from "react";
import { Select } from "antd";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styles from "./Selector.module.less";

const Selector = () => {
  const [value, setValue] = useState();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setValue(location.pathname);
  }, [location]);

  return (
    <div className={styles.container}>
      <Select
        options={[
          { label: `Classic (d6, d20…)`, value: "/roll-dnd" },
          { label: `L5R AEG`, value: "/roll-d10" },
          { label: `Star Wars FFG`, value: "/roll-ffg-sw" },
          { label: `Cyberpunk RED`, value: "/cyberpunk/roll" },
        ]}
        value={value}
        onChange={(value) => {
          navigate(value);
        }}
        className={styles.selector}
      />
    </div>
  );
};

export default Selector;
