import { Action } from 'redux';
import { Part } from '../models';
import { PartActions } from '../actions';
import { createSelector } from 'reselect';
import { AppState } from '../reducers';

/**
 * This file describes the state concerning the Part, how to modify it through
 * the reducer, and the selectors.
 */
export interface PartState {
    currentPart: Part;
};

const initialState: PartState = {
    currentPart: null
};

export const PartReducer =
    function(state: PartState = initialState, action: Action): PartState {
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

export const getPartState = (state: AppState): PartState => state.part;

export const getCurrentPart = createSelector(
    getPartState,
    (state: PartState) => state.currentPart);
