import { createSlice, configureStore } from '@reduxjs/toolkit';

interface State {
  menuOpen: boolean;
}

interface Action {
  payload: State;
}

const slice = createSlice({
  name: 'menuOpen',
  initialState: {
    menuOpen: false,
  } as State,
  reducers: {
    changeMenuOpen: (state: State, action: Action) => {
      // eslint-disable-next-line no-param-reassign
      state.menuOpen = action.payload.menuOpen;
    },
  },
});

export const { changeMenuOpen } = slice.actions;

const storeMenuOpen = configureStore({
  reducer: slice.reducer,
});

export default storeMenuOpen;
