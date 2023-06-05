import { createSlice, configureStore } from '@reduxjs/toolkit';

interface State {
  showAppBar: boolean;
}

interface Action {
  payload: State;
}

const slice = createSlice({
  name: 'load',
  initialState: {
    showAppBar: true,
  } as State,
  reducers: {
    changeShowAppBar: (state: State, action: Action) => {
      // eslint-disable-next-line no-param-reassign
      state.showAppBar = action.payload.showAppBar;
    },
  },
});

export const { changeShowAppBar } = slice.actions;

const storeShowAppBar = configureStore({
  reducer: slice.reducer,
});

export default storeShowAppBar;
