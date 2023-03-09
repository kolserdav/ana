import { createSlice, configureStore } from '@reduxjs/toolkit';
import { MessageType, SendMessageArgs } from '../types/interfaces';

interface State {
  projectMessage: SendMessageArgs<MessageType.SET_POST_PROJECT_MESSAGE> | null;
}

interface Action {
  payload: State;
}

const slice = createSlice({
  name: 'projectMessage',
  initialState: {
    projectMessage: null,
  } as State,
  reducers: {
    changeProjectMessage: (state: State, action: Action) => {
      // eslint-disable-next-line no-param-reassign
      state.projectMessage = action.payload.projectMessage;
    },
  },
});

export const { changeProjectMessage } = slice.actions;

const storeProjectMessage = configureStore({
  reducer: slice.reducer,
});

export default storeProjectMessage;
