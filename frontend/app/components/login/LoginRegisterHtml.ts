export var LoginRegisterHtml = `
    <div class="col-sm-8 col-sm-offset-2">
        <div class="col-md-6 col-md-offset-3">
            <h2>{{heading}}</h2>
            <form [formGroup]="loginForm">
                <div class="form-group">
                    <input type="text" (focus)="loginFailed = false"
                        [formControl]="loginForm.controls['username']"
                        id="username" class="form-control"
                        name="username" placeholder="username" (focus)="bfrFrstVldshn = false">
                </div>
                <div *ngIf="(username.hasError('required') || username.hasError('invalidInput')) && username.touched"
                     class="alert alert-danger">Username is invalid</div>
                <div class="form-group">
                    <input type="password" (focus)="loginFailed = false"
                        [formControl]="loginForm.controls['password']"
                        id="password" class="form-control"
                        name="password" placeholder="password" (focus)="bfrFrstVldshn = false">
                </div>
                <div *ngIf="(password.hasError('required') || password.hasError('invalidInput')) && password.touched"
                     class="alert alert-danger">Password is invalid</div>
                <button id="submit-button" (click)="submitPrelim(loginForm.value)" class="btn btn-primary"
                        [disabled]="!loginForm.valid && !bfrFrstVldshn">Submit</button>
                <br><br>
                <div *ngIf="loginFailed" class="alert alert-danger">Failed login</div>

                <div *ngIf="heading === 'Login'">
                    <button id="register-button" (click)="register()" class="btn btn-primary">Register</button>
                </div>
                
                <div *ngIf="heading === 'Register'">

                    <md-radio-group id="radio-group"
                        [(ngModel)]="userGroup"
                        [formControl]="loginForm.controls['radioGroup']">
                        <div *ngFor="let o of radioOptions" >
                            <md-radio-button [value]="o.value">{{o.label}}</md-radio-button>
                        </div>
                    </md-radio-group>

                </div>
            </form>
        </div>
    </div>
  `;
