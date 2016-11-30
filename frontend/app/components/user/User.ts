import {Component, Inject} from '@angular/core';
import {FormBuilder, AbstractControl, FormGroup} from '@angular/forms';
import {Store, AppStore, AppState, MenuActions, Menu} from '../../redux_barrel';

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

export class User {

    userForm: FormGroup;
    radioGroup: AbstractControl;
    userGroup: string = 'readonly';
    radioOptions: any = [
        {value: 'admin', label: 'Admin'},
        {value: 'readonly', label: 'ReadOnly'},
        {value: 'editor', label: 'Editor'}
    ];

    constructor (@Inject(AppStore) private store: Store<AppState>, private fb: FormBuilder) {
        let currentMenu: Menu = {id: 'user', path: '/dashboard/user'};
        store.dispatch(MenuActions.setCurrentMenu(currentMenu));
        this.userForm = fb.group({
            'radioGroup': []
        });
        this.radioGroup = this.userForm.controls['radioGroup'];
    }

    getState () {
        return this.store.getState();
    }
}
