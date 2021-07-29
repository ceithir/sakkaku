import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "semiauto",
  displayMode: "compact",
};

const slice = createSlice({
  name: "rollConfig",
  initialState,
  reducers: {
    updateConfig: (state, { payload }) => {
      for (const key in payload) {
        state[key] = payload[key];
      }
    },
  },
});

export const { updateConfig } = slice.actions;

export const selectMode = (state) => state.rollConfig.mode;
export const selectDisplayMode = (state) => state.rollConfig.displayMode;
export const selectConfig = (state) => state.rollConfig;

export default slice.reducer;
