import React, { useEffect, useState } from "react";
import Intent from "./Intent";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAll,
  create,
  softReset,
  keep,
  selectStep,
  setAddKept,
  keepInsteadOfChanneling,
  channel,
  addModifiers,
  channelInsteadOfKeeping as channelInsteadOfKeepingFunc,
} from "./reducer";
import Keep from "./Keep";
import Summary from "./Summary";
import { Collapse } from "antd";
import { setParameters, load, initToKeep, setAdvanced } from "./reducer";
import DefaultErrorMessage from "../../DefaultErrorMessage";
import NextButton from "./NextButton";
import { selectUser } from "../user/reducer";
import { DECLARE, REROLL, KEEP, RESOLVE } from "./Steps";
import RerollResult from "./result/Reroll";
import KeepResult from "./result/Keep";
import ResolveResult from "./result/Resolve";
import { isReroll, rolledDicesCount } from "./utils";
import Modifier from "./Modifier";
import Channel from "./Channel";
import Layout from "./Layout";
import styles from "./index.module.less";
import Title from "features/display/Title";

export const StandardRoller = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (!dispatch) {
      return;
    }
    dispatch(setAdvanced(false));
  }, [dispatch]);

  return <Roller {...props} />;
};

export const AdvancedRoller = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (!dispatch) {
      return;
    }
    dispatch(setAdvanced(true));
  }, [dispatch]);

  return <Roller {...props} />;
};

const Roller = ({ save }) => {
  const roll = useSelector(selectAll);
  const user = useSelector(selectUser);
  const currentStep = useSelector(selectStep);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!save || !dispatch) {
      return;
    }
    dispatch(setParameters({ ...save, ...save.roll.parameters }));
    dispatch(
      load({
        id: save.id,
        dices: save.roll.dices,
        metadata: save.roll.metadata,
        player: save.user,
      })
    );
  }, [save, dispatch]);

  const [activeKeys, setActiveKeys] = useState([DECLARE]);
  useEffect(() => {
    // FIXME: Naming inconsistency
    if (currentStep === REROLL) {
      setActiveKeys(["modify"]);
      return;
    }
    setActiveKeys([currentStep]);
  }, [currentStep]);

  // FIXME: Shouldn't probably be handled here and that way
  useEffect(() => {
    if (currentStep !== KEEP) {
      return;
    }
    dispatch(initToKeep());
  }, [currentStep, dispatch, roll.dices.length]);

  const {
    dices,
    tn,
    modifiers,
    ring,
    skill,
    error,
    id,
    description,
    metadata,
    addkept,
    channelInsteadOfKeeping,
  } = roll;

  const basePool = rolledDicesCount(roll);
  const rerollTypes = metadata?.rerolls || [];

  if (error) {
    return <DefaultErrorMessage />;
  }

  const disabled = (panel) => {
    if (currentStep === panel) {
      return false;
    }

    if (panel === RESOLVE) {
      return currentStep !== RESOLVE;
    }

    if (panel === KEEP) {
      return ![KEEP, RESOLVE].includes(currentStep);
    }

    if (panel === REROLL) {
      if (currentStep === DECLARE) {
        return true;
      }

      return !modifiers.some(isReroll);
    }

    return false;
  };

  const PanelContent = ({ name }) => {
    if (disabled(name)) {
      return null;
    }

    if (name === RESOLVE) {
      return (
        <ResolveResult
          dices={dices}
          tn={tn}
          button={
            <NextButton onClick={() => dispatch(softReset())}>
              New roll
            </NextButton>
          }
          id={id}
          description={description}
          basePool={basePool}
          rerollTypes={rerollTypes}
          approach={metadata?.approach}
        />
      );
    }

    if (name === KEEP) {
      if (currentStep === KEEP) {
        const addReroll =
          modifiers.length < 100
            ? () => {
                dispatch(
                  addModifiers(roll, [
                    `ruleless${modifiers.length.toString().padStart(2, "0")}`,
                  ])
                );
              }
            : null;
        const addAlteration =
          modifiers.length < 100
            ? () =>
                dispatch(
                  addModifiers(roll, [
                    `reasonless${modifiers.length.toString().padStart(2, "0")}`,
                  ])
                )
            : null;

        if (channelInsteadOfKeeping) {
          const cancel = () => dispatch(keepInsteadOfChanneling());

          return (
            <Channel
              dices={dices}
              basePool={basePool}
              rerollTypes={rerollTypes}
              onFinish={(toChannel) => dispatch(channel(roll, toChannel))}
              cancel={cancel}
            />
          );
        }

        return (
          <Keep
            dices={dices}
            onFinish={(toKeep, toAdd) => dispatch(keep(roll, toKeep, toAdd))}
            tn={tn}
            ring={ring}
            skill={skill}
            rerollTypes={rerollTypes}
            addkept={addkept}
            setAddKept={(data) => dispatch(setAddKept(data))}
            modifiers={modifiers}
            addReroll={addReroll}
            addAlteration={addAlteration}
            channel={() => dispatch(channelInsteadOfKeepingFunc())}
          />
        );
      }
      return (
        <KeepResult
          dices={dices}
          basePool={basePool}
          rerollTypes={rerollTypes}
        />
      );
    }

    if (name === REROLL) {
      if (currentStep === REROLL) {
        return <Modifier roll={roll} dispatch={dispatch} />;
      }

      return (
        <RerollResult
          dices={dices}
          basePool={basePool}
          rerollTypes={rerollTypes}
          metadata={metadata}
        />
      );
    }

    return null;
  };

  if (currentStep === DECLARE) {
    return (
      <div className={styles["intent-container"]}>
        <Title>{`Legend of the Five Rings (FFG) – Check Roll`}</Title>
        <div>
          <Intent
            onFinish={(data) => dispatch(create({ ...roll, ...data }, user))}
            values={roll}
          />
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <Collapse
        activeKey={activeKeys}
        onChange={setActiveKeys}
        items={[
          {
            label: "Declare",
            key: "declare",
            collapsible: currentStep === DECLARE ? "disabled" : "header",
            children: <Summary {...roll} metadata={metadata} />,
          },
          {
            label: "Modify",
            key: "modify",
            collapsible:
              disabled(REROLL) || currentStep === REROLL
                ? "disabled"
                : "header",
            children: <PanelContent name={REROLL} />,
          },
          {
            label: "Keep",
            key: "keep",
            collapsible:
              disabled(KEEP) || currentStep === KEEP ? "disabled" : "header",
            children: <PanelContent name={KEEP} />,
          },
          {
            label: "Resolve",
            key: "resolve",
            collapsible:
              disabled(RESOLVE) || currentStep === RESOLVE
                ? "disabled"
                : "header",
            children: <PanelContent name={RESOLVE} />,
          },
        ]}
      />
    </Layout>
  );
};

export default Roller;
