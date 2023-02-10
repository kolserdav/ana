import { createSlice, configureStore } from '@reduxjs/toolkit';

interface State {
  scroll: boolean;
}

interface Action {
  payload: State;
}

const slice = createSlice({
  name: 'scroll',
  initialState: {
    scroll: false,
  } as State,
  reducers: {
    changeScroll: (state: State, action: Action) => {
      // eslint-disable-next-line no-param-reassign
      state.scroll = action.payload.scroll;
    },
  },
});

export const { changeScroll } = slice.actions;

const storeScroll = configureStore({
  reducer: slice.reducer,
});

export default storeScroll;
