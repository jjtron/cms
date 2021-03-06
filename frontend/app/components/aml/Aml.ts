import {Component, Inject} from '@angular/core';
import {Store, AppStore, AppState} from '../../redux_barrel';
import {Base} from '../Base';
import {BASEPATH} from '../dashboard/config';
import {Router} from '@angular/router';

@Component({
  selector: 'aml-component',
  styleUrls: [
    'app/css/styles.css'
  ],
  template: `hello`
})

export class Aml extends Base {
    constructor (
        @Inject(AppStore) protected store: Store<AppState>,
        @Inject(BASEPATH) protected basepath: string,
        protected router: Router) {
            super(store, basepath, 'aml', router);
    }
}
