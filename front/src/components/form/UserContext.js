import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Divider,
  AutoComplete,
  Switch,
  Alert,
  Button,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCampaigns,
  selectCharacters,
  selectUser,
  setShowReconnectionModal,
} from "features/user/reducer";
import styles from "./UserContext.module.less";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { LoginOutlined, ClearOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

const defaultRules = [{ required: true, message: "Please fill this field" }];

export const arrayToAutoCompleteOptions = (values) => {
  if (!values) {
    return undefined;
  }

  return [...values]
    .sort((a, b) => a.localeCompare(b))
    .map((value) => {
      return {
        value,
      };
    });
};

const QuickLoginButton = () => {
  const dispatch = useDispatch();

  return (
    <Button
      onClick={() => {
        dispatch(setShowReconnectionModal(true));
      }}
      icon={<LoginOutlined />}
    >{`Log in`}</Button>
  );
};

const AnonymousAlert = () => {
  const location = useLocation();
  const [params, setParams] = useState({});
  useEffect(() => {
    setParams(queryString.parse(location.search));
  }, [location]);

  const campaign = params.campaign;
  const description = campaign ? (
    <>
      <p>{`This appears to be a campaign roll, for the campaign "${campaign}".`}</p>
      <p>{`Please log in first to access all information your GM added to it in top of the usual benefits for being logged it (like rolls being persisted in the database).`}</p>
      <div className={styles["button-wrapper"]}>
        <QuickLoginButton />
      </div>
    </>
  ) : (
    <>
      <p>{`No history of your rolls will be kept, and you won't be able to retrieve or share them later.`}</p>
      <div className={styles["button-wrapper"]}>
        <QuickLoginButton />
      </div>
    </>
  );

  return (
    <Alert
      className={styles["anonymous-alert"]}
      showIcon
      message={`You are not logged in.`}
      description={description}
      type={campaign ? "error" : "warning"}
      closeIcon={true}
    />
  );
};

const UserContext = ({ description = {} }) => {
  const campaigns = useSelector(selectCampaigns);
  const characters = useSelector(selectCharacters);
  const user = useSelector(selectUser);
  const [testMode, setTestMode] = useState(false);
  const [showTag, setShowTag] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  const form = Form.useFormInstance();
  useEffect(() => {
    const params = queryString.parse(location.search);
    if (params.campaign) {
      form.setFieldsValue({ campaign: params.campaign });
    }
    if (params.description) {
      form.setFieldsValue({ description: params.description });
    }
    if (params.tag) {
      form.setFieldsValue({ tag: params.tag });
      setShowTag(true);
    } else {
      setShowTag(false);
    }
  }, [location, form]);

  if (!user) {
    return <AnonymousAlert />;
  }

  return (
    <>
      <Form.Item
        label={`Test mode`}
        name="testMode"
        valuePropName="checked"
        className={styles["test-mode"]}
        tooltip={`The roll won't be saved if you activate this option.`}
      >
        <Switch onChange={(checked) => setTestMode(checked)} value={testMode} />
      </Form.Item>
      <div className={styles.clear} />
      {!testMode && (
        <>
          <fieldset className={styles.identifiers}>
            <Form.Item label={`Campaign`} name="campaign" rules={defaultRules}>
              <AutoComplete
                options={arrayToAutoCompleteOptions(campaigns)}
                placeholder={`The Dead of Winter`}
                filterOption={true}
                disabled={showTag}
              />
            </Form.Item>
            <Form.Item
              label={`Character`}
              name="character"
              rules={defaultRules}
            >
              <AutoComplete
                options={arrayToAutoCompleteOptions(characters)}
                placeholder={`Doji Sakura`}
                filterOption={true}
              />
            </Form.Item>
          </fieldset>
          <Form.Item
            label={`Description`}
            name="description"
            rules={description.rules || defaultRules}
          >
            <TextArea placeholder={description.placeholder} />
          </Form.Item>
          {showTag && (
            <div className={styles["tag-wrapper"]}>
              <Form.Item
                label={`Tagged as`}
                name="tag"
                className={styles.tag}
                tooltip={`Some additional data your GM has specificied to help with their bookkeeping. Remove if (now) irrelevant.`}
              >
                <Input disabled={true} />
              </Form.Item>
              <Button
                onClick={() => {
                  navigate(location.pathname);
                }}
              >
                <ClearOutlined />
                {`Remove`}
              </Button>
            </div>
          )}
        </>
      )}
      <Divider />
    </>
  );
};

export default UserContext;
