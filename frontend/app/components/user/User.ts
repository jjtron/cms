import {Component, Inject} from '@angular/core';
import {FormBuilder, AbstractControl, FormGroup} from '@angular/forms';
import {Store, AppStore, AppState} from '../../redux_barrel';
import {BASEPATH} from '../dashboard/config';
import {Base} from '../Base';
import {DataService} from '../../services/DataService';
import {Response} from '@angular/http';
import {Router} from '@angular/router';

const DEFAULT_ACCESS = 'noaccess';

@Component({
  selector: 'user-component',
  styleUrls: [
    'app/css/styles.css',
    'app/css/bootstrap.min.css'
  ],
  template: `
    <div class="col-md-6 col-md-offset-3">
        <form [formGroup]="userForm">
            <div>
                <md-input [formControl]="userForm.controls['userName']"
                        placeholder="username"
                        style="width: 25%"
                        (focus)="updateFailed = false">
                </md-input>
            </div>
            <md-checkbox [formControl]="userForm.controls['admin']">Admin</md-checkbox>
            <div [hidden]="admin.value">
                <md-radio-group *ngFor="let subject of permissionSubjects" style="padding: 10px"
                    [(ngModel)]="permissions[subject]"
                    [formControl]="userForm.controls[subject]">
                    <div>
                        <b>{{subject}}</b>
                    </div>
                    <div *ngFor="let o of radioOptions" >
                        <md-radio-button [value]="o.value">{{o.label}}</md-radio-button>
                    </div>
                </md-radio-group>
            </div>
            <button (click)="update()" class="btn btn-primary">Update</button>
            <div *ngIf="updateFailed">Update failed</div>
        </form>
    </div>
    `
})

export class User extends Base {

    userForm: FormGroup;
    permissionSubjects: Array<string> = ['aml', 'dwgs', 'parts'];
    radioOptions: any = [
        {value: 'readonly', label: 'ReadOnly'},
        {value: 'editor', label: 'Editor'},
        {value: 'noaccess', label: 'NoAccess'}
    ];
    permissions: any = {};
    tmpPermissions: any = {};
    admin: AbstractControl;
    userName: AbstractControl;
    previousAdmin: boolean = false;
    updateFailed: boolean = false;

    constructor (
        @Inject(AppStore) protected store: Store<AppState>,
        @Inject(BASEPATH) protected basepath: string,
        private fb: FormBuilder,
        private ds: DataService,
        protected router: Router) {
            super(store, basepath, 'user', router);

            this.permissionSubjects.map((s) => {
                this.permissions[s] = DEFAULT_ACCESS;
            });
            Object.assign(this.tmpPermissions, this.permissions);

            let groupObj: any = {};
            this.permissionSubjects.map((s) => {
                groupObj[s] = [];
            });
            groupObj.admin = [false];
            groupObj.userName = [];

            this.userForm = fb.group(groupObj);

            this.permissionSubjects.map((s) => {
                this[s] = this.userForm.controls[s];
            });
            this.admin = this.userForm.controls['admin'];
            this.userName = this.userForm.controls['userName'];

            this.userForm.valueChanges.subscribe((obj) => {
                this.updateFailed = false;
                if (obj.admin) {
                    this.permissionSubjects.map((s) => {
                        this.permissions[s] = 'editor';
                    });
                    this.previousAdmin = true;
                    return;
                } else if (this.previousAdmin) {
                    Object.assign(this.permissions, this.tmpPermissions);
                    this.previousAdmin = false;
                    return;
                } else {
                    Object.assign(this.tmpPermissions, this.permissions);
                    return;
                }
            });
    }

    update () {
        let userName = this.userForm.value.userName;
        delete this.userForm.value.userName;
        this.userForm.value.home = true; // set home default to true
        this.ds.updateUser(userName, this.userForm.value)
            .subscribe((res: any) => {
                this.updateFailed = false;
            },
            (error: Response) => {
                this.updateFailed = true;
            }
        );
    }
}
