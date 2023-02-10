import { createSlice, configureStore } from '@reduxjs/toolkit';
import { AlertProps } from '../types';

interface State {
  alert: AlertProps;
}

interface Action {
  payload: State;
}

const slice = createSlice({
  name: 'alert',
  initialState: {
    alert: {
      status: 'info',
      message: '',
    },
  } as State,
  reducers: {
    changeAlert: (state: State, action: Action) => {
      // eslint-disable-next-line no-param-reassign
      state.alert = action.payload.alert;
    },
  },
});

export const { changeAlert } = slice.actions;

const storeAlert = configureStore({
  reducer: slice.reducer,
});

export default storeAlert;
