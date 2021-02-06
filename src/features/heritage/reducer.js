import { createSlice } from "@reduxjs/toolkit";
import { postOnServer } from "../../server";

const slice = createSlice({
  name: "heritage",
  initialState: {
    dices: [],
    loading: false,
    error: null,
    metadata: {},
    previousRolls: [],
    context: {},
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    update: (state, action) => {
      const { dices, metadata } = action.payload;
      state.dices = dices;
      state.metadata = metadata;
      state.loading = false;
    },
    reset: (state) => {
      state.previousRolls = [
        { dices: state.dices, metadata: state.metadata },
        ...state.previousRolls,
      ];
      state.dices = [];
      state.metadata = {};
      state.context = {};
    },
    setContext: (state, action) => {
      state.context = action.payload;
    },
  },
});

export const { setLoading, setError, reset } = slice.actions;

const { update, setContext } = slice.actions;

export const create = ({ context, metadata }) => (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setContext(context));

  const error = (e) => {
    dispatch(setError(e));
  };

  postOnServer({
    uri: "/public/ffg/l5r/heritage-rolls/create",
    body: { metadata },
    success: (data) => {
      dispatch(update(data));
    },
    error,
  });
};

export const keep = (roll, position) => (dispatch) => {
  dispatch(setLoading(true));

  const error = (e) => {
    dispatch(setError(e));
  };

  postOnServer({
    uri: "/public/ffg/l5r/heritage-rolls/keep",
    body: { roll, position },
    success: (data) => {
      dispatch(update(data));
    },
    error,
  });
};

export const selectLoading = (state) => state.heritage.loading;
export const selectError = (state) => state.heritage.error;
export const selectRoll = (state) => {
  return { dices: state.heritage.dices, metadata: state.heritage.metadata };
};
export const selectPreviousRolls = (state) => state.heritage.previousRolls;
export const selectContext = (state) => state.heritage.context;

export default slice.reducer;
