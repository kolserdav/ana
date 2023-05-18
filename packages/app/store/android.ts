import { createSlice, configureStore } from '@reduxjs/toolkit';

interface State {
  android: boolean;
}

interface Action {
  payload: State;
}

const slice = createSlice({
  name: 'android',
  initialState: {
    android: false,
  } as State,
  reducers: {
    changeAndroid: (state: State, action: Action) => {
      // eslint-disable-next-line no-param-reassign
      state.android = action.payload.android;
    },
  },
});

export const { changeAndroid } = slice.actions;

const storeAndroid = configureStore({
  reducer: slice.reducer,
});

export default storeAndroid;
