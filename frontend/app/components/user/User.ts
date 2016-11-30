import {Component, Inject} from '@angular/core';
import {FormBuilder, AbstractControl, FormGroup} from '@angular/forms';
import {Store, AppStore, AppState} from '../../redux_barrel';
import {BASEPATH} from '../dashboard/config';
import {Base} from '../Base';

@Component({
  selector: 'user-component',
  template: `
    <form [formGroup]="userForm">
        <md-radio-group id="radio-group"
            [(ngModel)]="userGroup"
            [formControl]="userForm.controls['radioGroup']">
            <div *ngFor="let o of radioOptions" >
                <md-radio-button [value]="o.value">{{o.label}}</md-radio-button>
            </div>
        </md-radio-group>
    </form>
    `
})

export class User extends Base {

    userForm: FormGroup;
    radioGroup: AbstractControl;
    userGroup: string = 'readonly';
    radioOptions: any = [
        {value: 'admin', label: 'Admin'},
        {value: 'readonly', label: 'ReadOnly'},
        {value: 'editor', label: 'Editor'}
    ];

    constructor (
        @Inject(AppStore) protected store: Store<AppState>,
        @Inject(BASEPATH) protected basepath: string,
        private fb: FormBuilder) {
            super(store, basepath, 'user');
            this.userForm = fb.group({
                'radioGroup': []
            });
            this.radioGroup = this.userForm.controls['radioGroup'];
    }
}
