import { inject, fakeAsync, async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { By } from '@angular/platform-browser';
import { DataServiceMock } from '../mocks/DataServiceMock';
import { DataService } from '../../app/services/DataService';
import { advance, createRoot, RootCmp, configureAppTests, BlankCmp } from '../helpers/AppTestsHelper';
import { FormGroup, FormControl } from '@angular/forms';

const jwt: string = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IjEyMyIsInBhc3N3b3JkIjoiMTIzIiwicGVybWlzc2lvbnMiOnsiYW1sIjoiZWRpdG9yIiwiZHdncyI6ImVkaXRvciIsInBhcnRzIjoiZWRpdG9yIiwiYWRtaW4iOiJ0cnVlIiwiaG9tZSI6InRydWUifSwiaWF0IjoxNDgwODA5MTQ5fQ.OEGk8XjOpRcofrLF2vJIqufTrCc4u6dNm0JIbUe5pvU';

describe('LoginForm spec 1', () => {
    beforeEach(async(() => {
        configureAppTests();
        localStorage.removeItem('token');
    }));

    describe('On route to login form', () => {
        it('gets form ready for input', fakeAsync(
          inject([Router, DataService, Location],
                 (router: Router,
                  dataServiceMock: DataServiceMock,
                  location: Location) => {
            const fixture = createRoot(router, RootCmp);
            expect(location.path()).toEqual('/');

            router.navigateByUrl('login');
            advance(fixture);
            expect(location.path()).toEqual('/login');

            const loginForm = fixture.debugElement.children[1].componentInstance;
            expect(loginForm.loginFailed).toBe(false);
            expect(loginForm.loginForm).toEqual(jasmine.any(FormGroup));
            expect(loginForm.username).toEqual(jasmine.any(FormControl));
            expect(loginForm.password).toEqual(jasmine.any(FormControl));
          })));
    });

    describe('Clicking submit button with good credentials', () => {
        it('sets localStorage token', fakeAsync(
          inject([Router, DataService],
                 (router: Router,
                  dataServiceMock: DataServiceMock) => {
            const fixture = createRoot(router, RootCmp);
            router.navigateByUrl('login');
            advance(fixture);

            const loginForm = fixture.debugElement.children[1].componentInstance;

            dataServiceMock.setResponse(jwt);         
            loginForm.submit({username: 'u', password: 'p'});
            advance(fixture);

            expect(loginForm.decodedJwt.username).toBe('123');
            expect(localStorage.getItem('token')).toBe(jwt);
            expect(fixture.debugElement.children[1].componentInstance instanceof BlankCmp).toBe(true);

          })));
    });

    describe('Clicking submit button with bad credentials', () => {
        it('return as an error', fakeAsync(
          inject([Router, DataService],
                 (router: Router,
                  dataServiceMock: DataServiceMock) => {
            const fixture = createRoot(router, RootCmp);
            router.navigateByUrl('login');
            advance(fixture);

            const loginForm = fixture.debugElement.children[1].componentInstance;

            dataServiceMock.setAltLoginSpy();
            dataServiceMock.setResponse('somerandomtokenstring');         
            loginForm.submit({username: 'u', password: 'p'});
            advance(fixture);
                     
            expect(localStorage.getItem('token')).toBe('');
            expect(loginForm.loginFailed).toBe(true);

          })));
    });

    describe('Clicking register button', () => {
        it('should navigate to register page', fakeAsync(
          inject([Router, DataService, Location],
                 (router: Router,
                  dataServiceMock: DataServiceMock,
                  location: Location) => {
            const fixture = createRoot(router, RootCmp);
            router.navigateByUrl('login');
            advance(fixture);

            const loginForm = fixture.debugElement.children[1].componentInstance;

            loginForm.register();
            advance(fixture);
            expect(location.path()).toEqual('/register');

          })));
    });
    
    describe('Going to register form and clicking on Admin group', () => {
        xit('should change radio group to Admin', fakeAsync(
          inject([Router, DataService, Location],
                 (router: Router,
                  dataServiceMock: DataServiceMock,
                  location: Location) => {
            const fixture = createRoot(router, RootCmp);
            router.navigateByUrl('login');
            advance(fixture);

            const loginForm = fixture.debugElement.children[1].componentInstance;

            loginForm.register();
            advance(fixture);
            expect(location.path()).toEqual('/register');
                     
            const registerForm = fixture.debugElement.children[1].componentInstance;
            expect(registerForm.userGroup).toEqual('readonly');
            
            // ref: https://github.com/angular/material2/blob/master/src/lib/radio/radio.spec.ts
            registerForm.radioOptions = [
                { value: 'x', label: 'X' },
                { value: 'y', label: 'Y' },
                { value: 'z', label: 'Z' }
            ];
            advance(fixture);
            let radioButtons = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
            radioButtons[0].nativeElement.dispatchEvent(new Event('change'));
            advance(fixture);
            expect(registerForm.userGroup).toEqual('x');       
                     
          })));
    });
});
