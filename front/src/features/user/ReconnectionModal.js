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

const Iframe = ({ setSuccess }) => {
  const dispatch = useDispatch();

  // FIXME: There's definetely a better solution than spamming the server
  useInterval(() => {
    fetchUser(dispatch, setSuccess);
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

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (show) {
      setSuccess(false);
    }
  }, [show]);

  if (!show) {
    return null;
  }

  const close = () => dispatch(setShowReconnectionModal(false));

  return (
    <Modal open={true} closeIcon={null} footer={null} onCancel={close}>
      {!success && (
        <>
          <Alert
            message={`You are currently logged out. Please log in to pursue.`}
            type="warning"
            showIcon
            className={styles.message}
          />
          <Iframe setSuccess={setSuccess} />
        </>
      )}
      {success && (
        <Alert
          message={`Success! You can now close this window and continue what you were doing before this interruption.`}
          type="success"
          showIcon
          className={styles.message}
        />
      )}
    </Modal>
  );
};

export default ReconnectionModal;
