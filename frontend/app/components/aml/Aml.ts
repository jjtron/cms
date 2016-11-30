import {Component, Inject} from '@angular/core';
import {Store, AppStore, AppState} from '../../redux_barrel';
import {Base} from '../Base';
import {BASEPATH} from '../dashboard/config';

@Component({
  selector: 'aml-component',
  styleUrls: [
    'app/css/styles.css',
    'app/css/bootstrap.min.css'
  ],
  template: `hello`
})

export class Aml extends Base {
    constructor (
        @Inject(AppStore) protected store: Store<AppState>,
        @Inject(BASEPATH) protected basepath: string) {
            super(store, basepath, 'aml');
    }
}
