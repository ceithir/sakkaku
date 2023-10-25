import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import styles from "./Menu.module.less";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../user/reducer";
import logo150 from "./logo-150.png";
import logo100 from "./logo-100.png";
import logo50 from "./logo-50.png";

const CustomMenu = () => {
  const user = useSelector(selectUser);
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState();

  useEffect(() => {
    const getMenuKey = ({ pathname, search }) => {
      if (pathname === "/") {
        return "home";
      }

      if (["/roll", "/heritage", "/probabilities"].includes(pathname)) {
        return "ffg";
      }

      if (["/roll-d10", "/roll-d10-4th-ed"].includes(pathname)) {
        return "aeg";
      }

      if (["/roll-dnd"].includes(pathname)) {
        return "dnd";
      }

      if (["/roll-ffg-sw"].includes(pathname)) {
        return "ffg-sw";
      }

      if (["/cyberpunk/roll"].includes(pathname)) {
        return "cyberpunk";
      }

      if (pathname === "/rolls" && !search) {
        return "all_rolls";
      }

      if (pathname === "/rolls" && !!user && search === `?player=${user.id}`) {
        return "my_rolls";
      }

      if (pathname === "/gm/prefiller") {
        return "prefiller";
      }

      return pathname.substring(1, pathname.length);
    };

    setSelectedKey(getMenuKey(location));
  }, [location, user]);

  const items = [
    {
      key: "home",
      label: (
        <Link to="/">
          <img
            alt="Logo"
            src={logo50}
            width="50"
            height="50"
            srcSet={`${logo50}, ${logo100} 2x, ${logo150} 3x`}
          />
        </Link>
      ),
    },
    {
      label: `New roll`,
      popupOffset: [-20, 0],
      theme: "light",
      popupClassName: styles["sub-menu"],
      children: [
        {
          key: "dnd",
          label: <Link to="/roll-dnd">{`Classic (d6, d20, d4, d12…)`}</Link>,
        },
        {
          type: "group",
          label: `Legend of the Five Rings`,
          children: [
            {
              key: "aeg",
              label: <Link to="/roll-d10">{`AEG Roll & Keep (d10)`}</Link>,
            },
            {
              key: "ffg",
              label: <Link to="/roll">{`FFG Roll & Keep (custom dice)`}</Link>,
            },
          ],
        },
        {
          type: "group",
          label: `Star Wars`,
          children: [
            {
              key: "ffg-sw",
              label: <Link to="/roll-ffg-sw">{`FFG custom dice`}</Link>,
            },
          ],
        },
        {
          type: "group",
          label: `Misc`,
          children: [
            {
              key: "cyberpunk",
              label: <Link to="/cyberpunk/roll">{`Cyberpunk RED`}</Link>,
            },
          ],
        },
      ],
    },
    { key: "all_rolls", label: <Link to="/rolls">{`Saved rolls`}</Link> },
    {
      label: `GM tools`,
      theme: "light",
      popupClassName: styles["sub-menu"],
      popupOffset: [-20, 0],
      children: [
        {
          key: "prefiller",
          label: <Link to="/gm/prefiller">{`Prefill roll options`}</Link>,
        },
      ],
    },
    !!user && {
      key: "my_rolls",
      label: <Link to={`/rolls?player=${user.id}`}>{`My rolls`}</Link>,
      className: styles["push-to-right"],
    },
    {
      key: "login",
      label: user ? (
        <a href="/user/profile">{user.name}</a>
      ) : (
        <a href="/login">{`Login`}</a>
      ),
      className: !user && styles["push-to-right"],
    },
  ].filter(Boolean);

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[selectedKey]}
      onSelect={({ key }) => setSelectedKey(key)}
      className={styles.menu}
      items={items}
    />
  );
};

export default CustomMenu;
