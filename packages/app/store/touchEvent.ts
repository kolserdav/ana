import { createSlice, configureStore } from '@reduxjs/toolkit';

interface State {
  touchEvent: 'start' | 'end';
}

interface Action {
  payload: State;
}

const slice = createSlice({
  name: 'touchEvent',
  initialState: {
    touchEvent: 'end',
  } as State,
  reducers: {
    changeTouchEvent: (state: State, action: Action) => {
      // eslint-disable-next-line no-param-reassign
      state.touchEvent = action.payload.touchEvent;
    },
  },
});

export const { changeTouchEvent } = slice.actions;

const storeTouchEvent = configureStore({
  reducer: slice.reducer,
});

export default storeTouchEvent;
