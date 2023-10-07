import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";

const CardSubmenu = () => {
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
      key: "draw-cards",
      label: <Link to="/draw-cards">{`Draw some cards`}</Link>,
    },
    {
      key: "build-deck",
      label: <Link to="/build-deck">{`Configure shareable deck`}</Link>,
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

export default CardSubmenu;
