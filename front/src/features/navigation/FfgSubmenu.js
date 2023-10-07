import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";

const FfgSubmenu = () => {
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState();

  useEffect(() => {
    const getMenuKey = ({ pathname }) => {
      if (pathname === "/resources/rokugan-map") {
        return "rokugan-map";
      }

      return pathname.substring(1, pathname.length);
    };

    setSelectedKey(getMenuKey(location));
  }, [location]);

  const items = [
    {
      key: "roll",
      label: <Link to="/roll">{`Check Roll`}</Link>,
    },
    { key: "heritage", label: <Link to="/heritage">{`Heritage Roll`}</Link> },
    {
      key: "probabilities",
      label: <Link to="/probabilities">{`Probabilities`}</Link>,
    },
    {
      key: "rokugan-map",
      label: <Link to="/resources/rokugan-map">{`World map`}</Link>,
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

export default FfgSubmenu;
