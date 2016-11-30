import {Store, AppState, MenuActions, Menu} from '../redux_barrel';

export class Base {
    constructor (
        protected store: Store<AppState>,
        protected basepath: string,
        protected path: string) {
            let menu: Menu = this.getState().menu.currentMenu;
            let access: any = null;
            if (menu) {
                access = menu.access;
            }
            let currentMenu: Menu = {
                id: path,
                path: basepath + path,
                access: access
            };
            store.dispatch(MenuActions.setCurrentMenu(currentMenu));
    }

    getState () {
        return this.store.getState();
    }
}
