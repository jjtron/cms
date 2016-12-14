import {Component, Inject} from '@angular/core';
import {Store, AppStore, AppState} from '../../redux_barrel';
import {Base} from '../Base';
import {BASEPATH} from '../dashboard/config';
import {Router} from '@angular/router';
import {DataService} from '../../services/DataService';
import {Amp} from '../../models/Amp';

@Component({
  selector: 'aml-component',
  styleUrls: [
    'app/css/styles.css'
  ],
  template: `
    <input type="text" [(ngModel)]="mfgr" />
    <input type="text" [(ngModel)]="mpn" />
    <button (click)="add()">Add</button>`
})

export class Aml extends Base {

    mfgr: string = '';
    mpn: string = '';
    amp: Amp = {id: null, mfgr: '', mpn: ''};
    constructor (
        @Inject(AppStore) protected store: Store<AppState>,
        @Inject(BASEPATH) protected basepath: string,
        protected router: Router,
        private ds: DataService) {
            super(store, basepath, 'aml', router);
    }

    add () {
        if (!this.mfgr || !this.mpn) {
            return;
        }
        this.amp.mfgr = this.mfgr;
        this.amp.mpn = this.mpn;
        this.ds.postAmp(this.amp).subscribe((resp) => {
            console.log(resp);
        });
    }
}
