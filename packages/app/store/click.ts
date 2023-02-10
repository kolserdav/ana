import { createSlice, configureStore } from '@reduxjs/toolkit';

interface State {
  clientX: number;
  clientY: number;
}

interface Action {
  payload: State;
}

const slice = createSlice({
  name: 'click',
  initialState: {
    clientX: 0,
    clientY: 0,
  } as State,
  reducers: {
    changeClick: (state: State, action: Action) => {
      // eslint-disable-next-line no-param-reassign
      state.clientX = action.payload.clientX;
      // eslint-disable-next-line no-param-reassign
      state.clientY = action.payload.clientY;
    },
  },
});

export const { changeClick } = slice.actions;

const storeClick = configureStore({
  reducer: slice.reducer,
});

export default storeClick;
