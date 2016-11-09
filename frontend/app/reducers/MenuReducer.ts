import { Action } from 'redux';
import { Menu } from '../models';
import { MenuActions } from '../actions';
import { createSelector } from 'reselect';
import { AppState } from '../reducers';

/**
 * This file describes the state concerning the Menu, how to modify it through
 * the reducer, and the selectors.
 */
export interface MenuState {
    currentMenu: Menu;
};

const initialState: MenuState = {
    currentMenu: null
};

export const MenuReducer =
    function(state: MenuState = initialState, action: Action): MenuState {
        switch (action.type) {
            case MenuActions.SET_CURRENT_MENU:
                const menu: Menu = (<MenuActions.SetCurrentMenuAction>action).menu;
                return {
                    currentMenu: menu
                };
            default:
                return state;
        }
    };

export const getMenuState = (state: AppState): MenuState => state.menu;

export const getCurrentMenu = createSelector(
    getMenuState,
    (state: MenuState) => state.currentMenu);
