import { createSlice } from "@reduxjs/toolkit";
import { getOnServer } from "server";

const slice = createSlice({
  name: "user",
  initialState: {
    campaigns: [],
    characters: [],
    showReconnectionModal: false,
  },
  reducers: {
    setUser: (state, action) => {
      const { id, name, campaigns, characters, superadmin } = action.payload;
      state.id = id;
      state.name = name;
      state.campaigns = campaigns;
      state.characters = characters;
      state.superadmin = superadmin;
    },
    addCampaign: (state, action) => {
      const campaign = action.payload;
      if (!!campaign && !state.campaigns.includes(campaign)) {
        state.campaigns.push(campaign);
      }
    },
    addCharacter: (state, action) => {
      const character = action.payload;
      if (!!character && !state.characters.includes(character)) {
        state.characters.push(character);
      }
    },
    setShowReconnectionModal: (state, action) => {
      state.showReconnectionModal = action.payload;
    },
  },
});

export const { setUser, addCampaign, addCharacter, setShowReconnectionModal } =
  slice.actions;

export const selectUser = (state) => (state.user.id ? state.user : undefined);
export const selectCampaigns = (state) => state.user.campaigns;
export const selectCharacters = (state) => state.user.characters;
export const selectShowReconnectionModal = (state) =>
  state.user.showReconnectionModal;

export const fetchUser = (dispatch, callback) => {
  getOnServer({
    uri: "/user",
    success: (data) => {
      dispatch(setUser(data));
      callback && callback(data);
    },
    error: (_) => {},
  });
};

export default slice.reducer;
