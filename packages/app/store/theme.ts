import { createSlice, configureStore } from '@reduxjs/toolkit';
import { ThemeType } from '../Theme';
import { DEFAULT_THEME } from '../utils/constants';
import { getLocalStorage, LocalStorageName } from '../utils/localStorage';

interface State {
  theme: ThemeType;
}

interface Action {
  payload: State;
}

const slice = createSlice({
  name: 'theme',
  initialState: {
    theme: getLocalStorage(LocalStorageName.THEME) || DEFAULT_THEME,
  } as State,
  reducers: {
    changeTheme: (state: State, action: Action) => {
      // eslint-disable-next-line no-param-reassign
      state.theme = action.payload.theme;
    },
  },
});

export const { changeTheme } = slice.actions;

const storeTheme = configureStore({
  reducer: slice.reducer,
});

export default storeTheme;
