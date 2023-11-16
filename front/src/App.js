import React, { useEffect } from "react";
import "./App.less";
import { StandardRoller, AdvancedRoller } from "./features/roller";
import Layout from "./features/navigation/Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import List from "./features/browse/List";
import IdentifiedRoll from "./features/roller/IdentifiedRoll";
import { useDispatch } from "react-redux";
import { fetchUser } from "./features/user/reducer";
import HeritageRoll from "./features/heritage/Roll";
import Calculator from "./features/probabilities/Calculator";
import Homepage from "./features/navigation/Homepage";
import Map from "./features/trinket/Map";
import ScrollToTop from "./features/navigation/ScrollToTop";
import FfgSubmenu from "features/navigation/FfgSubmenu";
import ReconnectionModal from "features/user/ReconnectionModal";
import Prefiller from "features/gm/Prefiller";
import Show from "features/browse/Show";
import UnifiedRoller from "features/unified/Roller";

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
        <Routes>
          <Route path="/gm/prefiller" element={<Prefiller />} />
          <Route
            path="/resources/rokugan-map"
            element={
              <>
                <FfgSubmenu />
                <Map />
              </>
            }
          />
          <Route
            path="/probabilities"
            element={
              <>
                <FfgSubmenu />
                <Calculator />
              </>
            }
          />
          <Route
            path="/heritage"
            element={
              <>
                <FfgSubmenu />
                <HeritageRoll />
              </>
            }
          />
          <Route path="/rolls/:id" element={<IdentifiedRoll />} />
          <Route path="/rolls" element={<List />} />
          <Route
            path="/roll-advanced"
            element={
              <>
                <FfgSubmenu />
                <AdvancedRoller />
              </>
            }
          />
          <Route
            path="/roll-dnd"
            element={<UnifiedRoller rollType={"DnD"} />}
          />
          <Route path="/r/:id" element={<Show />} />
          <Route
            path="/roll-d10"
            element={<UnifiedRoller rollType={"AEG-L5R"} />}
          />
          <Route
            path="/roll"
            element={
              <>
                <FfgSubmenu />
                <StandardRoller />
              </>
            }
          />
          <Route
            path="/roll-ffg-sw"
            element={<UnifiedRoller rollType={"FFG-SW"} />}
          />
          <Route
            path="/cyberpunk/roll"
            element={<UnifiedRoller rollType={"Cyberpunk-RED"} />}
          />
          <Route path="/" element={<Homepage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
