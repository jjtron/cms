import {Component, Inject} from '@angular/core';
import {Store, AppStore, AppState, MenuActions, Menu} from '../../redux_barrel';

@Component({
  selector: 'parts-component',
  template: `parts`
})

export class Parts {

    constructor (@Inject(AppStore) private store: Store<AppState>) {
        let currentMenu: Menu = {id: 'parts', path: '/dashboard/parts'};
        store.dispatch(MenuActions.setCurrentMenu(currentMenu));
    }

    getState () {
        return this.store.getState();
    }
}
