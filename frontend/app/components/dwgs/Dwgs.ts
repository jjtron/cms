import {Component, Inject} from '@angular/core';
import {Store, AppStore, AppState, MenuActions, Menu} from '../../redux_barrel';

@Component({
  selector: 'dwgs-component',
  template: `dwgs`
})

export class Dwgs {

    constructor (@Inject(AppStore) private store: Store<AppState>) {
        let currentMenu: Menu = {id: 'dwgs', path: '/dashboard/dwgs'};
        store.dispatch(MenuActions.setCurrentMenu(currentMenu));
    }

    getState () {
        return this.store.getState();
    }
}
