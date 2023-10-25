import React, { useEffect } from "react";
import "./App.less";
import { StandardRoller, AdvancedRoller } from "./features/roller";
import Layout from "./features/navigation/Layout";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import List from "./features/browse/List";
import IdentifiedRoll from "./features/roller/IdentifiedRoll";
import { useDispatch } from "react-redux";
import { fetchUser } from "./features/user/reducer";
import HeritageRoll from "./features/heritage/Roll";
import HeritageRollLoader from "./features/heritage/RollLoader";
import Calculator from "./features/probabilities/Calculator";
import Homepage from "./features/navigation/Homepage";
import Map from "./features/trinket/Map";
import ScrollToTop from "./features/navigation/ScrollToTop";
import FfgSubmenu from "features/navigation/FfgSubmenu";
import D10Roller from "features/d10/D10Roller";
import AegSubmenu from "features/navigation/AegSubmenu";
import ReconnectionModal from "features/user/ReconnectionModal";
import DnDRoller from "features/dnd/Roller";
import FFGSWRoller from "features/sw/Roller";
import FFGSWRoll from "features/sw/Roll";
import DrawCards from "features/cards/Draw";
import IdDraw from "features/cards/IdDraw";
import DeckBuilder from "features/cards/DeckBuilder";
import CardSubmenu from "features/navigation/CardSubmenu";
import CyberpunkRoller from "features/cyberpunk/Roller";
import CyberpunkRoll from "features/cyberpunk/Roll";
import Prefiller from "features/gm/Prefiller";
import Show from "features/browse/Show";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    fetchUser(dispatch);
  }, [dispatch]);

  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <ReconnectionModal />
        <Switch>
          <Route path="/gm/prefiller" exact>
            <Prefiller />
          </Route>
          <Route path="/resources/rokugan-map" exact>
            <FfgSubmenu />
            <Map />
          </Route>
          <Route path="/probabilities" exact>
            <FfgSubmenu />
            <Calculator />
          </Route>
          <Route path="/heritage/:uuid" exact>
            <HeritageRollLoader />
          </Route>
          <Route path="/heritage" exact>
            <FfgSubmenu />
            <HeritageRoll />
          </Route>
          <Route path="/rolls/:id" exact>
            <IdentifiedRoll />
          </Route>
          <Route path="/rolls" exact>
            <List />
          </Route>
          <Route path="/roll-advanced" exact>
            <FfgSubmenu />

            <AdvancedRoller />
          </Route>
          <Route path="/d10-rolls/:id" exact>
            <Show />
          </Route>
          <Route path="/roll-dnd" exact>
            <DnDRoller />
          </Route>
          <Route path="/dnd-rolls/:id" exact>
            <Show />
          </Route>
          <Route path="/roll-d10" exact>
            <AegSubmenu />
            <D10Roller />
          </Route>
          <Route path="/roll" exact>
            <FfgSubmenu />
            <StandardRoller />
          </Route>
          <Route path="/roll-ffg-sw" exact>
            <FFGSWRoller />
          </Route>
          <Route path="/ffg-sw-rolls/:id" exact>
            <FFGSWRoll />
          </Route>
          <Route path="/draw-cards" exact>
            <CardSubmenu />
            <DrawCards />
          </Route>
          <Route path="/build-deck" exact>
            <CardSubmenu />
            <DeckBuilder />
          </Route>
          <Route path="/draws/:id" exact>
            <IdDraw />
          </Route>
          <Route path="/cyberpunk/roll" exact>
            <CyberpunkRoller />
          </Route>
          <Route path="/cyberpunk/rolls/:id" exact>
            <CyberpunkRoll />
          </Route>
          <Route path="/" exact>
            <Homepage />
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
};

export default App;
