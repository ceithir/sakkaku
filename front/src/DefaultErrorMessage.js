import React from "react";
import { Alert } from "antd";

const DefaultErrorMessage = () => {
  return (
    <Alert
      message={`Something bad happened.`}
      description={
        <>
          <>{`Possibly, just a minor network hiccup at the worst timing. Possibly, a devious bug in Sakkaku's code. I don't know, I'm just a generic error message.`}</>
          <br />
          <>{`Try reloading the page. If things are still broken, please contact the administrator using the link at the very bottom of the page.`}</>
        </>
      }
      type="error"
      showIcon={true}
    />
  );
};

export default DefaultErrorMessage;
