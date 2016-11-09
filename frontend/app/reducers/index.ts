import { Reducer, combineReducers } from 'redux';

import { UsersState, UsersReducer } from './UsersReducer';
import { PartsState, PartsReducer } from './PartsReducer';

export * from './UsersReducer';

export interface AppState {
  users: UsersState;
  parts: PartsState;
}

const rootReducer: Reducer<AppState> = combineReducers<AppState>({
  users: UsersReducer,
  parts: PartsReducer
});

export default rootReducer;
