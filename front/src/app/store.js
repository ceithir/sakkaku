import { configureStore } from "@reduxjs/toolkit";
import rollerReducer from "../features/roller/reducer";
import userReducer from "../features/user/reducer";
import heritageReducer from "../features/heritage/reducer";

export default configureStore({
  reducer: {
    roll: rollerReducer,
    user: userReducer,
    heritage: heritageReducer,
  },
});
