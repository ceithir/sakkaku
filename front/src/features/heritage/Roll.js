import React from "react";
import { Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { selectError, selectRoll, keep, reset, selectContext } from "./reducer";
import DefaultErrorMessage from "../../DefaultErrorMessage";
import styles from "./Roll.module.less";
import Form from "./Form";
import Summary from "./Summary";
import Layout from "./Layout";
import SummaryList from "./SummaryList";
import { CopyLink } from "components/aftermath/CopyButtons";
import { link } from "./StaticRoll";

const Roll = () => {
  const error = useSelector(selectError);
  const dispatch = useDispatch();
  const roll = useSelector(selectRoll);
  const context = useSelector(selectContext);

  const { dices, metadata } = roll;

  if (error) {
    return <DefaultErrorMessage />;
  }

  if (!dices.length) {
    return (
      <Layout>
        <Form />
      </Layout>
    );
  }

  const { table } = metadata;

  if (dices.some(({ status }) => status === "pending")) {
    return (
      <Layout
        dices={dices}
        context={context}
        instruction={`Choose one of those two options as the relative for whom your character is named.`}
      >
        <SummaryList
          list={dices
            .filter(({ status }) => status === "pending")
            .map(({ value }, index) => {
              return {
                rolls: [value],
                footer: (
                  <div className={styles.footer}>
                    <Button
                      onClick={() => dispatch(keep({ roll, position: index }))}
                    >{`Keep that result`}</Button>
                  </div>
                ),
              };
            })}
          table={table}
        ></SummaryList>
      </Layout>
    );
  }

  return (
    <Layout dices={dices} context={context}>
      <div>
        <Summary
          table={table}
          rolls={dices
            .filter(({ status }) => status === "kept")
            .map(({ value }) => value)}
        />
        <div className={styles.footer}>
          <CopyLink link={link(roll.uuid)} />
          <Button
            onClick={() => {
              dispatch(reset());
            }}
            type="dashed"
          >{`Roll another heritage`}</Button>
        </div>
      </div>
    </Layout>
  );
};

export default Roll;
