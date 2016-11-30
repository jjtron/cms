import {Component, Inject} from '@angular/core';
import {Store, AppStore, AppState, MenuActions, Menu} from '../../redux_barrel';
import {BASEPATH} from './config';

@Component({
  selector: 'home-component',
  template: `home`,
})

export class DashboardHome {

    constructor (
        @Inject(AppStore) private store: Store<AppState>,
        @Inject(BASEPATH) public basepath: string) {
            let currentMenu: Menu = {id: 'home', path: basepath + 'home'};
            store.dispatch(MenuActions.setCurrentMenu(currentMenu));
    }

    getState () {
        return this.store.getState();
    }
}
