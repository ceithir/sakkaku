import React from "react";
import { Layout } from "antd";
import styles from "./Layout.module.less";
import Menu from "./Menu";

const { Header, Content, Footer } = Layout;

const CustomLayout = ({ children }) => {
  return (
    <Layout className={styles.layout}>
      <Header>
        <Menu />
      </Header>
      <Content>{children}</Content>
      <Footer className={styles.footer}>
        {`A dice roller with a public roll history, for easy use in play-by-post.`}
        <br />
        {`This website is not affiliated in any way with any of the licenses it offers rollers for.`}
        <br />
        {`For any issue or suggestion: `}
        <a href="mailto:contact.sakkaku@gmail.com">{`contact.sakkaku@gmail.com`}</a>
      </Footer>
    </Layout>
  );
};

export default CustomLayout;
