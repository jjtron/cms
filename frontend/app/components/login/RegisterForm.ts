import {Component} from '@angular/core';
import {FormBuilder, Validators, AbstractControl} from '@angular/forms';
import {Response} from '@angular/http';
import {DataService} from '../../services/DataService';
import {Router} from '@angular/router';
import {LoginRegisterBase} from './LoginRegisterBase';
import {LoginRegisterHtml} from './LoginRegisterHtml';

@Component({
  selector: 'register-form',
  styleUrls: [
    'app/css/styles.css',
    'app/css/bootstrap.min.css'
  ],
  template: LoginRegisterHtml
})
export class RegisterForm extends LoginRegisterBase {

    heading: string = 'Register';
    username: AbstractControl;
    password: AbstractControl;
    admin: AbstractControl;

    constructor(
        protected fb: FormBuilder,
        protected ds: DataService,
        protected router: Router) {
            super(router);
            this.loginForm = fb.group({
                'username': ['', Validators.compose([
                    Validators.required, this.inputValidator])],
                'password': ['', Validators.compose([
                    Validators.required, this.inputValidator])],
                'admin': [false],
            });
            this.username = this.loginForm.controls['username'];
            this.password = this.loginForm.controls['password'];
            this.admin = this.loginForm.controls['admin'];
    }

    submit (form: any) {
        this.ds.register(form.username, form.password, form.admin)
            .subscribe(
                (res: any) => {
                    if (res.status !== 201) {
                        this.loginFailed = true;
                    } else {
                        this.router.navigate(['/login']);
                    }
                },
                (error: Response) => {
                    this.loginFailed = true;
                });
        return false;
    }
}