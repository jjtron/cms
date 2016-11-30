import {Component, Inject} from '@angular/core';
import {Store, AppStore, AppState} from '../../redux_barrel';
import {Base} from '../Base';
import {BASEPATH} from '../dashboard/config';

@Component({
  selector: 'parts-component',
  template: `parts`
})

export class Parts extends Base {
    constructor (
        @Inject(AppStore) protected store: Store<AppState>,
        @Inject(BASEPATH) protected basepath: string) {
            super(store, basepath, 'parts');
    }
}
