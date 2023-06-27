import { createSlice, configureStore } from '@reduxjs/toolkit';

interface State {
  focus: boolean;
}

interface Action {
  payload: State;
}

const slice = createSlice({
  name: 'alert',
  initialState: {
    focus: false,
  } as State,
  reducers: {
    changeFocus: (state: State, action: Action) => {
      // eslint-disable-next-line no-param-reassign
      state.focus = action.payload.focus;
    },
  },
});

export const { changeFocus } = slice.actions;

const storeFocus = configureStore({
  reducer: slice.reducer,
});

export default storeFocus;
