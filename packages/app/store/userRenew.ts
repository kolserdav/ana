import { createSlice, configureStore } from '@reduxjs/toolkit';

interface State {
  userRenew: boolean;
}

interface Action {
  payload: State;
}

const slice = createSlice({
  name: 'load',
  initialState: {
    userRenew: true,
  } as State,
  reducers: {
    changeUserRenew: (state: State, action: Action) => {
      // eslint-disable-next-line no-param-reassign
      state.userRenew = action.payload.userRenew;
    },
  },
});

export const { changeUserRenew } = slice.actions;

const storeUserRenew = configureStore({
  reducer: slice.reducer,
});

export default storeUserRenew;
