import { Action, ActionCreator } from 'redux';
import { Part } from '../models';

export const SET_CURRENT_PART = '[Part] Set Current';
export interface SetCurrentPartAction extends Action { part: Part; }
export const setCurrentPart: ActionCreator<SetCurrentPartAction> =
  (part) => ({
    type: SET_CURRENT_PART,
    part: part
  });
