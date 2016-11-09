import {FormGroup, FormControl} from '@angular/forms';
import {DataService} from '../../services/DataService';
import {Router} from '@angular/router';

export class LoginRegisterBase {

    loginForm: FormGroup;
    loginFailed: boolean = false;

    // enables submit button when the form is first opened (bfrFrstVldshn = before first validation)
    // because autofill username/password does not trigger validation and if there
    // is a username/password autofilled, then the user can go ahead an submit anyway
    bfrFrstVldshn: boolean = true;

    constructor(
        protected router: Router) {
            localStorage.setItem('token', '');
    }

    inputValidator(control: FormControl): { [s: string]: boolean } {
        if (!control.value.match(/^[a-zA-Z0-9]{3}$/)) {
            return {invalidInput: true};
        }
    }

    submitPrelim (form: any) {
        this.bfrFrstVldshn = false;
        if (this.loginForm.valid) {
            this.submit(form);
        }
    }

    submit (form: any) {}

    register () {
        this.router.navigate(['/register']);
        return false;
    }
}
