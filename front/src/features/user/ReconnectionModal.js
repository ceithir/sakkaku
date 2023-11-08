import React, { useState, useEffect } from "react";
import { Modal, Alert } from "antd";
import styles from "./ReconnectionModal.module.less";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUser,
  selectShowReconnectionModal,
  setShowReconnectionModal,
} from "./reducer";
import useInterval from "useInterval";
import useTimeout from "useTimeout";

const Iframe = ({ setShowSuccessMessage }) => {
  const dispatch = useDispatch();

  // FIXME: There's definetely a better solution than spamming the server
  useInterval(() => {
    fetchUser(dispatch, () => {
      dispatch(setShowReconnectionModal(false));
      setShowSuccessMessage(true);
    });
  }, 1 * 1000);

  // To avoid an infinity of calls, close the modal after three minutes
  useTimeout(() => {
    dispatch(setShowReconnectionModal(false));
  }, 3 * 60 * 1000);

  return <iframe title={`Login page`} src="/login" className={styles.iframe} />;
};

const ReconnectionModal = () => {
  const show = useSelector(selectShowReconnectionModal);
  const dispatch = useDispatch();

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const close = () => dispatch(setShowReconnectionModal(false));

  useEffect(() => {
    if (show) {
      setShowSuccessMessage(false);
    }
  }, [show]);

  if (showSuccessMessage) {
    return (
      <Alert
        message={`Success! You can now continue what you were doing before this interruption.`}
        type="success"
        showIcon
        closable={true}
        onClose={() => {
          setShowSuccessMessage(false);
        }}
      />
    );
  }

  if (!show) {
    return null;
  }

  return (
    <Modal open={true} closeIcon={null} footer={null} onCancel={close}>
      <Alert
        message={`You are currently logged out. Please log in to pursue.`}
        type="warning"
        showIcon
        className={styles.message}
      />
      <Iframe setShowSuccessMessage={setShowSuccessMessage} />
    </Modal>
  );
};

export default ReconnectionModal;
