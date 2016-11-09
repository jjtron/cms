import { Action } from 'redux';
import { Part } from '../models';
import { PartActions } from '../actions';
import { createSelector } from 'reselect';
import { AppState } from '../reducers';

/**
 * This file describes the state concerning Parts, how to modify it through
 * the reducer, and the selectors.
 */
export interface PartsState {
  currentPart: Part;
};

const initialState: PartsState = {
  currentPart: null
};

export const PartsReducer =
  function(state: PartsState = initialState, action: Action): PartsState {
  switch (action.type) {
    case PartActions.SET_CURRENT_PART:
    const part: Part = (<PartActions.SetCurrentPartAction>action).part;
      return {
        currentPart: part
      };
    default:
      return state;
  }
};

export const getPartsState = (state: AppState): PartsState => state.parts;

export const getCurrentPart = createSelector(
  getPartsState,
  ( state: PartsState ) => state.currentPart );
