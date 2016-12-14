import { Reducer, combineReducers } from 'redux';

import { MenuState, MenuReducer } from './MenuReducer';
import { PartState, PartReducer } from './PartReducer';

export * from './MenuReducer';
export * from './PartReducer';

export interface AppState {
  menu: MenuState;
  part: PartState;
}

const rootReducer: Reducer<AppState> = combineReducers<AppState>({
  menu: MenuReducer,
  part: PartReducer
});

export default rootReducer;
