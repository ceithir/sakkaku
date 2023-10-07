import { createSlice } from "@reduxjs/toolkit";
import { postOnServer, authentifiedPostOnServer } from "../../server";
import { DECLARE, REROLL, KEEP, RESOLVE } from "./Steps";
import { isReroll, bestKeepableDice } from "./utils";
import { setShowReconnectionModal } from "features/user/reducer";

const initialState = {
  modifiers: [],
  dices: [],
  metadata: {},
  loading: false,
  error: false,
  toKeep: [],
  channeled: [],
  addkept: [],
  channelInsteadOfKeeping: false,
  delayAfterDistinction: false,
  advanced: false,
};

const slice = createSlice({
  name: "roll",
  initialState,
  reducers: {
    softReset: (state) => {
      const fromAdvancedForm = state.modifiers.includes("unrestricted");

      state.tn = initialState.tn;
      state.ring = initialState.ring;
      state.skill = initialState.skill;
      state.description = null;
      state.dices = [];
      state.metadata = {};
      state.modifiers = [];
      state.toKeep = [];
      state.channeled = [];
      state.addkept = [];
      state.channelInsteadOfKeeping = false;
      state.delayAfterDistinction = false;

      state.id = null;

      window.history.pushState(
        null,
        null,
        fromAdvancedForm ? "/roll-advanced" : "/roll"
      );
    },
    setParameters: (state, action) => {
      const {
        campaign,
        character,
        description,
        tn,
        ring,
        skill,
        modifiers,
        channeled,
        addkept,
      } = action.payload;
      state.campaign = campaign;
      state.character = character;
      state.description = description;
      state.tn = tn;
      state.ring = ring;
      state.skill = skill;
      state.modifiers = modifiers;
      state.channeled = channeled;
      state.addkept = addkept;
      if (ring === 0) {
        state.channelInsteadOfKeeping = true;
      }
      state.advanced = modifiers.includes("unrestricted");
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    load: (state, action) => {
      const { id, player, dices, metadata } = action.payload;
      state.id = id;
      state.player = player;
      state.dices = dices;
      state.metadata = metadata;

      state.loading = false;
      window.history.pushState(null, null, `/rolls/${id}`);
    },
    update: (state, action) => {
      const { dices, metadata } = action.payload;
      state.dices = dices;
      state.metadata = metadata;

      state.loading = false;
    },
    setToKeep: (state, action) => {
      state.toKeep = action.payload;
    },
    setAddKept: (state, action) => {
      state.addkept = action.payload;
    },
    setModifiers: (state, action) => {
      state.modifiers = action.payload;
    },
    channelInsteadOfKeeping: (state) => {
      state.channelInsteadOfKeeping = true;
    },
    keepInsteadOfChanneling: (state) => {
      state.channelInsteadOfKeeping = false;
    },
    setDelayAfterDistinction: (state, action) => {
      state.delayAfterDistinction = action.payload;
    },
    initToKeep: (state) => {
      state.toKeep = bestKeepableDice(state);
    },
    setAdvanced: (state, { payload: advanced }) => {
      state.advanced = advanced;
    },
  },
});

export const {
  setParameters,
  setLoading,
  softReset,
  load,
  setToKeep,
  setAddKept,
  channelInsteadOfKeeping,
  keepInsteadOfChanneling,
  setDelayAfterDistinction,
  initToKeep,
  setAdvanced,
} = slice.actions;

const { update, setError, setModifiers } = slice.actions;

const errorHandler = (dispatch) => {
  return (err) => {
    if (err.message === "Authentication issue") {
      dispatch(setShowReconnectionModal(true));
    } else {
      dispatch(setError(true));
    }
    dispatch(setLoading(false));
  };
};

export const create = (request, user) => (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setParameters(request));

  const error = errorHandler(dispatch);

  const {
    tn,
    ring,
    skill,
    modifiers,
    campaign,
    character,
    description,
    channeled,
    addkept,
    metadata,
    testMode,
  } = request;

  if (user && !testMode) {
    authentifiedPostOnServer({
      uri: "/ffg/l5r/rolls/create",
      body: {
        tn,
        ring,
        skill,
        modifiers,
        campaign,
        character,
        description,
        channeled,
        addkept,
        metadata,
      },
      success: (data) => {
        dispatch(load({ ...data, player: user }));
      },
      error,
    });
    return;
  }

  postOnServer({
    uri: "/public/ffg/l5r/rolls/create",
    body: {
      tn,
      ring,
      skill,
      modifiers,
      channeled,
      addkept,
      metadata,
    },
    success: (data) => {
      dispatch(update(data));
    },
    error,
  });
};

export const reroll = (roll, positions, modifier, label) => (dispatch) => {
  dispatch(setLoading(true));

  const success = (data) => {
    dispatch(update(data));
  };
  const error = errorHandler(dispatch);

  const { id } = roll;
  if (id) {
    authentifiedPostOnServer({
      uri: `/ffg/l5r/rolls/${id}/reroll`,
      body: {
        positions,
        modifier,
        label,
      },
      success,
      error,
    });
    return;
  }

  const { tn, ring, skill, modifiers, dices, metadata } = roll;
  postOnServer({
    uri: "/public/ffg/l5r/rolls/reroll",
    body: {
      roll: {
        parameters: { tn, ring, skill, modifiers },
        dices,
        metadata,
      },
      positions,
      modifier,
      label,
    },
    success,
    error,
  });
};

export const alter = (roll, alterations, modifier, label) => (dispatch) => {
  dispatch(setLoading(true));

  const success = (data) => {
    dispatch(update(data));
  };
  const error = errorHandler(dispatch);

  const { id } = roll;
  if (id) {
    authentifiedPostOnServer({
      uri: `/ffg/l5r/rolls/${id}/alter`,
      body: {
        alterations,
        modifier,
        label,
      },
      success,
      error,
    });
    return;
  }

  const { tn, ring, skill, modifiers, dices, metadata } = roll;
  postOnServer({
    uri: "/public/ffg/l5r/rolls/alter",
    body: {
      roll: {
        parameters: { tn, ring, skill, modifiers },
        dices,
        metadata,
      },
      alterations,
      modifier,
      label,
    },
    success,
    error,
  });
};

export const keep = (roll, positions, toAdd) => (dispatch) => {
  dispatch(setLoading(true));

  const success = (data) => {
    dispatch(update(data));
  };
  const error = errorHandler(dispatch);

  const { id } = roll;
  if (id) {
    const authKeep = () =>
      authentifiedPostOnServer({
        uri: `/ffg/l5r/rolls/${id}/keep`,
        body: {
          positions,
        },
        success,
        error,
      });

    if (toAdd?.length) {
      authentifiedPostOnServer({
        uri: `/ffg/l5r/rolls/${id}/parameters`,
        body: {
          addkept: toAdd,
        },
        success: authKeep,
        error,
      });
      return;
    }

    authKeep();
    return;
  }

  const { tn, ring, skill, modifiers, dices, metadata, addkept } = roll;
  postOnServer({
    uri: "/public/ffg/l5r/rolls/keep",
    body: {
      roll: {
        parameters: { tn, ring, skill, modifiers, addkept },
        dices,
        metadata,
      },
      positions,
    },
    success,
    error,
  });
};

export const addModifiers = (roll, newModifiers) => (dispatch) => {
  dispatch(setLoading(true));

  const { id, modifiers } = roll;
  const allModifiers = [...modifiers, ...newModifiers];

  updateModifiers(id, allModifiers, dispatch);
};

export const removeModifiers = (roll, deletedModifiers) => (dispatch) => {
  dispatch(setLoading(true));

  const { id, modifiers } = roll;
  const allModifiers = modifiers.filter(
    (mod) => !deletedModifiers.includes(mod)
  );

  updateModifiers(id, allModifiers, dispatch);
};

const updateModifiers = (id, allModifiers, dispatch) => {
  if (id) {
    authentifiedPostOnServer({
      uri: `/ffg/l5r/rolls/${id}/parameters`,
      body: {
        modifiers: allModifiers,
      },
      success: ({ parameters: { modifiers } }) => {
        dispatch(setModifiers(modifiers));
        dispatch(setLoading(false));
      },
      error: errorHandler(dispatch),
    });
    return;
  }

  dispatch(setModifiers(allModifiers));
  dispatch(setLoading(false));
};

export const channel = (roll, positions) => (dispatch) => {
  dispatch(setLoading(true));

  const success = (data) => {
    dispatch(update(data));
  };
  const error = errorHandler(dispatch);

  const { id } = roll;
  if (id) {
    authentifiedPostOnServer({
      uri: `/ffg/l5r/rolls/${id}/channel`,
      body: {
        positions,
      },
      success,
      error,
    });
    return;
  }

  const { tn, ring, skill, modifiers, dices, metadata } = roll;
  postOnServer({
    uri: "/public/ffg/l5r/rolls/channel",
    body: {
      roll: {
        parameters: { tn, ring, skill, modifiers },
        dices,
        metadata,
      },
      positions,
    },
    success,
    error,
  });
};

export const selectAll = (state) => state.roll;
export const selectLoading = (state) => state.roll.loading;
export const selectStep = (state) => {
  const { dices, metadata, modifiers } = state.roll;

  const dicesRolled = dices.length > 0;
  const atLeastOneUnresolvedDice =
    dicesRolled && dices.some((dice) => dice.status === "pending");

  const currentRerollModifiers = modifiers.filter(isReroll);
  const hasReroll = currentRerollModifiers.length > 0;
  const rerollDone =
    !hasReroll || metadata?.rerolls?.length === currentRerollModifiers.length;

  if (dicesRolled && rerollDone && !atLeastOneUnresolvedDice) {
    return RESOLVE;
  }

  if (dicesRolled && rerollDone) {
    return KEEP;
  }

  if (dicesRolled && hasReroll) {
    return REROLL;
  }

  return DECLARE;
};
export const selectIntent = (state) => {
  const {
    campaign,
    character,
    description,
    tn,
    ring,
    skill,
    modifiers,
    player,
    channeled,
    addkept,
  } = state.roll;

  return {
    campaign,
    character,
    description,
    tn,
    ring,
    skill,
    modifiers,
    player,
    channeled,
    addkept,
  };
};

export const selectToKeep = (state) => state.roll.toKeep;

export const selectDelayAfterDistinction = (state) =>
  state.roll.delayAfterDistinction;

export const selectAdvanced = (state) => state.roll.advanced;

export default slice.reducer;
