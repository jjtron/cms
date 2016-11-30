import {Component, Inject} from '@angular/core';
import {FormBuilder, Validators, AbstractControl} from '@angular/forms';
import {Response} from '@angular/http';
import {DataService} from '../../services/DataService';
import {Router} from '@angular/router';
import {LoginRegisterBase} from './LoginRegisterBase';
import {LoginRegisterHtml} from './LoginRegisterHtml';
import {JwtHelper} from 'angular2-jwt';
import {Store, AppStore, AppState, MenuActions} from '../../redux_barrel';

@Component({
  selector: 'login-form',
  styleUrls: [
    'app/css/styles.css',
    'app/css/bootstrap.min.css'
  ],
  template: LoginRegisterHtml
})
export class LoginForm extends LoginRegisterBase {

    heading: string = 'Login';
    jwtHelper: JwtHelper = new JwtHelper();
    decodedJwt: any;
    username: AbstractControl;
    password: AbstractControl;

    constructor(
        protected fb: FormBuilder,
        protected ds: DataService,
        protected router: Router,
        @Inject(AppStore) private store: Store<AppState>) {
            super(router);
            this.loginForm = fb.group({
                'username': ['', Validators.compose([
                    Validators.required, this.inputValidator])],
                'password': ['', Validators.compose([
                    Validators.required, this.inputValidator])],
            });
            this.username = this.loginForm.controls['username'];
            this.password = this.loginForm.controls['password'];
    }

    submit (form: any) {
        this.ds.login(form.username, form.password)
            .subscribe(
                (res: any) => {
                    if (typeof res === 'object') {
                        this.loginFailed = true;
                    } else {
                        this.decodedJwt = this.jwtHelper.decodeToken(res);
                        localStorage.setItem('token', res);
                        this.store.dispatch(MenuActions.setCurrentMenu({
                            id: 'home',
                            path: '/dashboard/home',
                            access: this.decodedJwt.permissions
                        }));
                        this.router.navigate(['/dashboard']);
                    }
                },
                (error: Response) => {
                    this.loginFailed = true;
                });
        return false;
    }
}
