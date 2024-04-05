import React from "react";
import { Layout, Alert } from "antd";
import styles from "./Layout.module.less";
import Menu from "./Menu";
import ExternalLink from "./ExternalLink";

const { Header, Content, Footer } = Layout;

const TheEnd = () => {
  return (
    <Alert
      description={
        <>
          <p>
            {`Sakkaku will be decommissioned on `}
            <b>{`June 30th, 2024`}</b>
            {`.`}
          </p>
          <p>
            {`Alternatives: `}
            <ExternalLink href="https://orokos.com/roll/">{`Orokos`}</ExternalLink>
            {`, `}
            <ExternalLink href="https://help.roll20.net/hc/en-us/articles/360037773133-Dice-Reference">{`Roll20`}</ExternalLink>
            {`, `}
            <ExternalLink href="https://discord.com/application-directory/search?q=dice">{`many Discord bots`}</ExternalLink>
            {`…`}
          </p>
        </>
      }
      type="info"
      showIcon
      closable
    />
  );
};

const CustomLayout = ({ children }) => {
  return (
    <Layout className={styles.layout}>
      <Header>
        <Menu />
      </Header>
      <Content>
        <TheEnd />
        <>{children}</>
      </Content>
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
