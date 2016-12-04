import {Component, Inject} from '@angular/core';
import {Store, AppStore, AppState} from '../../redux_barrel';
import {Base} from '../Base';
import {BASEPATH} from '../dashboard/config';
import {Router} from '@angular/router';

@Component({
  selector: 'home-component',
  template: `home`,
})

export class DashboardHome extends Base {
    constructor (
        @Inject(AppStore) protected store: Store<AppState>,
        @Inject(BASEPATH) protected basepath: string,
        protected router: Router) {
            super(store, basepath, 'home', router);
    }
}
