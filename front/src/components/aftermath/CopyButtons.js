import React from "react";
import { Button, message } from "antd";
import { CopyToClipboard } from "react-copy-to-clipboard";

export const CopyLink = ({ link }) => {
  const buttonText = `Copy link`;

  if (!link) {
    return <Button disabled>{buttonText}</Button>;
  }

  return (
    <CopyToClipboard
      text={link}
      onCopy={() => message.success("Copied to clipboard!")}
    >
      <Button>{buttonText}</Button>
    </CopyToClipboard>
  );
};

export const BbCode = ({ link, bbMessage }) => {
  const buttonText = `Copy as BBCode`;

  if (!bbMessage || !link) {
    return <Button disabled>{buttonText}</Button>;
  }

  const text = `[url=${link}]${bbMessage}[/url]`;

  return (
    <CopyToClipboard
      text={text}
      onCopy={() => message.success("Copied to clipboard!")}
    >
      <Button>{buttonText}</Button>
    </CopyToClipboard>
  );
};

const CopyButtons = ({ link, bbMessage }) => {
  return (
    <>
      <CopyLink link={link} />
      <BbCode link={link} bbMessage={bbMessage} />
    </>
  );
};

export default CopyButtons;
