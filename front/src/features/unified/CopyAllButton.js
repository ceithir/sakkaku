import { Button, message } from "antd";
import { CopyToClipboard } from "react-copy-to-clipboard";

const CopyAllButton = ({ results }) => {
  const mergedBbCode = results
    .map(({ id, bbMessage }) => {
      if (!id || !bbMessage) {
        return "";
      }
      return `[url=${window.location.origin}/r/${id}]${bbMessage}[/url]`;
    })
    .join("\n\n")
    .trim();

  if (!mergedBbCode) {
    return null;
  }

  return (
    <CopyToClipboard
      text={mergedBbCode}
      onCopy={() => message.success("Copied to clipboard!")}
    >
      <Button>{`Copy all rolls as BBCode`}</Button>
    </CopyToClipboard>
  );
};

export default CopyAllButton;
