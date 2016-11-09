import { Reducer, combineReducers } from 'redux';

import { MenuState, MenuReducer } from './MenuReducer';

export * from './MenuReducer';

export interface AppState {
  menu: MenuState;
}

const rootReducer: Reducer<AppState> = combineReducers<AppState>({
  menu: MenuReducer
});

export default rootReducer;
