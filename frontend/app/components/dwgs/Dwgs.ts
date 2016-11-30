import {Component, Inject} from '@angular/core';
import {Store, AppStore, AppState, MenuActions, Menu} from '../../redux_barrel';
import {BASEPATH} from '../dashboard/config';

@Component({
  selector: 'dwgs-component',
  template: `dwgs`
})

export class Dwgs {

    constructor (
        @Inject(AppStore) private store: Store<AppState>,
        @Inject(BASEPATH) private basepath: string) {
            let currentMenu: Menu = {id: 'dwgs', path: basepath + 'dwgs'};
            store.dispatch(MenuActions.setCurrentMenu(currentMenu));
    }

    getState () {
        return this.store.getState();
    }
}
