import {Component, Inject} from '@angular/core';
import {Store, AppStore, AppState, MenuActions, Menu} from '../../redux_barrel';
import {BASEPATH} from '../dashboard/config';

@Component({
  selector: 'parts-component',
  template: `parts`
})

export class Parts {

    constructor (
        @Inject(AppStore) private store: Store<AppState>,
        @Inject(BASEPATH) private basepath: string) {
            let currentMenu: Menu = {id: 'parts', path: basepath + 'parts'};
            store.dispatch(MenuActions.setCurrentMenu(currentMenu));
    }

    getState () {
        return this.store.getState();
    }
}
