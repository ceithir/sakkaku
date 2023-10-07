import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import ExternalLink from "./ExternalLink";

const AegSubmenu = () => {
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState();

  useEffect(() => {
    const getMenuKey = ({ pathname }) => {
      return pathname.substring(1, pathname.length);
    };

    setSelectedKey(getMenuKey(location));
  }, [location]);

  const items = [
    {
      key: "roll-d10",
      label: <Link to="/roll-d10">{`XkY Roll`}</Link>,
    },
    {
      key: "probabilities",
      label: (
        <ExternalLink href="https://lynks.se/probability/">{`Probabilities`}</ExternalLink>
      ),
    },
  ];

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[selectedKey]}
      onSelect={({ key }) => setSelectedKey(key)}
      items={items}
    />
  );
};

export default AegSubmenu;
