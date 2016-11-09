import { Action, ActionCreator } from 'redux';
import { Menu } from '../models';

export const SET_CURRENT_MENU = '[Menu] Set Current';
export interface SetCurrentMenuAction extends Action { menu: Menu; }
export const setCurrentMenu: ActionCreator<SetCurrentMenuAction> =
  (menu) => ({
    type: SET_CURRENT_MENU,
    menu: menu
  });
