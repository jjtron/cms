import {Component, Inject} from '@angular/core';
import {Store, AppStore, AppState, MenuActions, Menu} from '../../redux_barrel';
import {BASEPATH} from '../dashboard/config';

@Component({
  selector: 'aml-component',
  styleUrls: [
    'app/css/styles.css',
    'app/css/bootstrap.min.css'
  ],
  template: `hello`
})

export class Aml {

    constructor (
        @Inject(AppStore) private store: Store<AppState>,
        @Inject(BASEPATH) private basepath: string) {
            let currentMenu: Menu = {id: 'aml', path: basepath + 'aml'};
            store.dispatch(MenuActions.setCurrentMenu(currentMenu));
    }

    getState () {
        return this.store.getState();
    }
}
