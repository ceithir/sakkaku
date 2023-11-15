import React, { useState } from "react";
import { Form, AutoComplete, Input, Select, Button } from "antd";
import styles from "./Prefiller.module.less";
import { useDispatch, useSelector } from "react-redux";
import { selectCampaigns, addCampaign } from "features/user/reducer";
import { arrayToAutoCompleteOptions } from "components/form/UserContext";
import CopyButtons from "components/aftermath/CopyButtons";
import queryString from "query-string";

const { TextArea } = Input;

const Prefiller = () => {
  const campaigns = useSelector(selectCampaigns);
  const dispatch = useDispatch();
  const [link, setLink] = useState();

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <p>{`Generate a link redirecting directly to the right kind of roller, with the campaign and a (optional) base description preset.`}</p>
        <Form
          className={styles.form}
          initialValues={{ type: "roll-dnd" }}
          onFinish={({ campaign, type, description }) => {
            const link = `${
              window.location.origin
            }/${type}/?${queryString.stringify(
              { campaign, description },
              { skipEmptyString: true }
            )}`;
            setLink(link);
            dispatch(addCampaign(campaign));
          }}
        >
          <Form.Item
            label={`Campaign`}
            name="campaign"
            rules={[
              { required: true, message: "Please enter a campaign name" },
            ]}
          >
            <AutoComplete
              options={arrayToAutoCompleteOptions(campaigns)}
              placeholder={`My Awesome Campaign`}
              filterOption={true}
            />
          </Form.Item>

          <Form.Item label={`Description`} name="description">
            <TextArea
              placeholder={`Day 2, Early Morning, Ikebana contest, Step 2\nDon't forget to list all your modifiers`}
            />
          </Form.Item>

          <Form.Item
            name="type"
            label={`Roll type`}
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { label: `Classic (d6, d20, d4, d12…)`, value: "roll-dnd" },
                { label: `L5R AEG`, value: "roll-d10" },
                { label: `Star Wars FFG`, value: "roll-ffg-sw" },
                { label: `Cyberpunk RED`, value: "cyberpunk/roll" },
              ]}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {`Generate`}
            </Button>
          </Form.Item>
        </Form>
      </div>
      {!!link && (
        <div className={styles.result}>
          <p>{`Use the following link to initiate a roll with the parameters entered above:`}</p>
          <a href={link} target="_blank" rel="noreferrer">
            {link}
          </a>
          <div className={styles.buttons}>
            <CopyButtons link={link} bbMessage={`Click here to roll.`} />
          </div>
        </div>
      )}
    </div>
  );
};
export default Prefiller;
