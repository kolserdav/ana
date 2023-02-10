import { createSlice, configureStore } from '@reduxjs/toolkit';

interface State {
  load: boolean;
}

interface Action {
  payload: State;
}

const slice = createSlice({
  name: 'load',
  initialState: {
    load: true,
  } as State,
  reducers: {
    changeLoad: (state: State, action: Action) => {
      // eslint-disable-next-line no-param-reassign
      state.load = action.payload.load;
    },
  },
});

export const { changeLoad } = slice.actions;

const storeLoad = configureStore({
  reducer: slice.reducer,
});

export default storeLoad;
