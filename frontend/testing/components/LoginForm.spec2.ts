import { Component } from '@angular/core';
import { TestBed, fakeAsync, inject, tick, async } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { By } from '@angular/platform-browser';
import { LoginForm } from '../../app/components/login/LoginForm';
import { Routes } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { DataService } from '../../app/services/DataService';
import { DataServiceMock } from '../mocks/DataServiceMock';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'root-cmp',
    template: `<router-outlet></router-outlet>`
})
export class RootCmp {
}

@Component({
    selector: 'blank-cmp',
    template: ``
})
export class BlankCmp {
}

export const routes: Routes = [
    { path: 'dashboard', component: BlankCmp },
];
export function createEvent(eventType: any): Event {
  var evt: Event = document.createEvent('Event');
  evt.initEvent(eventType, true, true);
  return evt;
}
export function dispatchEvent(element: any, eventType: any) {
  element.dispatchEvent(createEvent(eventType));
}

const BAD_INPUT = 'abcd';
const GOOD_INPUT = 'abc';

describe('Loginform spec 2', () => {
    let fixture: any;
    let el: any;
    let inputUsername: any;
    let inputPassword: any;
    let form: any;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterModule.forRoot(routes),
                FormsModule,
                ReactiveFormsModule
            ],
            declarations: [
                LoginForm,
                BlankCmp
            ],
            providers: [
                { provide: APP_BASE_HREF, useValue: '/' },
                { provide: DataService, useClass: DataServiceMock }
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(LoginForm);
            el = fixture.debugElement.nativeElement;
            inputUsername = fixture.debugElement.query(By.css("input[id='username']")).nativeElement;
            inputPassword = fixture.debugElement.query(By.css("input[id='password']")).nativeElement;
            form = fixture.debugElement.query(By.css('form')).nativeElement;
            fixture.detectChanges();
        });
    }));

    describe('Bad input on username field', () => {
        it('should show error div', fakeAsync(() => {
            inputUsername.value = BAD_INPUT;
            dispatchEvent(inputUsername, 'input');
            dispatchEvent(inputUsername, 'blur');
            fixture.detectChanges();
            tick();
            
            let errors = el.querySelectorAll('.alert');
            expect(errors.length).toBe(1);
            expect(errors[0].innerHTML).toContain('Username is invalid');
        }));
    });

    describe('No input on username field', () => {
        it('should show error div', fakeAsync(() => {
            inputUsername.value = '';
            dispatchEvent(inputUsername, 'input');
            dispatchEvent(inputUsername, 'blur');
            fixture.detectChanges();
            tick();
            
            let errors = el.querySelectorAll('.alert');
            expect(errors.length).toBe(1);
            expect(errors[0].innerHTML).toContain('Username is invalid');
        }));
    });

    describe('Bad input on password field', () => {
        it('should show error div', fakeAsync(() => {
            inputPassword.value = BAD_INPUT;
            dispatchEvent(inputPassword, 'input');
            dispatchEvent(inputPassword, 'blur');
            fixture.detectChanges();
            tick();
            
            let errors = el.querySelectorAll('.alert');
            expect(errors.length).toBe(1);
            expect(errors[0].innerHTML).toContain('Password is invalid');
        }));
    });

    describe('No input on password field', () => {
        it('should show error div', fakeAsync(() => {
            inputPassword.value = '';
            dispatchEvent(inputPassword, 'input');
            dispatchEvent(inputPassword, 'blur');
            fixture.detectChanges();
            tick();
            
            let errors = el.querySelectorAll('.alert');
            expect(errors.length).toBe(1);
            expect(errors[0].innerHTML).toContain('Password is invalid');
        }));
    });

    describe('Submit button', () => {
        it('should be disabled until form is valid', fakeAsync(() => {
            let submitButton = el.querySelector('#submit-button');
            expect(submitButton.disabled).toBe(false);
            dispatchEvent(inputUsername, 'focus');
            dispatchEvent(inputPassword, 'focus');
            fixture.detectChanges();
            tick();
            submitButton = el.querySelector('#submit-button');
            expect(submitButton.disabled).toBe(true);
        }));
    });
});
