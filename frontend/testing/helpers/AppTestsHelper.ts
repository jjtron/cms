import { Component, NgModule } from '@angular/core';
import { tick, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, Router, Routes, provideRoutes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppStore } from '../../app/app-store';
import { AppState, default as reducer} from '../../app/reducers';
import { createStore, Store } from 'redux';
import { MaterialModule } from '@angular/material';

import { LoginForm } from '../../app/components/login/LoginForm';
import { RegisterForm } from '../../app/components/login/RegisterForm';
import { DataServiceMock } from '../mocks/DataServiceMock';

import { Aml } from '../../app/components/aml/Aml';
import { Parts } from '../../app/components/parts/Parts';
import { Dwgs } from '../../app/components/dwgs/Dwgs';

import {BASEPATH} from '../../app/components/dashboard/config';

let store: Store<AppState> = createStore<AppState>(
  reducer
);

@Component({
    selector: 'blank-cmp',
    template: ``
})
export class BlankCmp {
}

@Component({
    selector: 'root-cmp',
    template: `<router-outlet></router-outlet>`
})
export class RootCmp {
}

export const routerConfig: Routes = [
    { path: '', component: BlankCmp },
    { path: 'login', component: LoginForm },
    { path: 'dashboard', component: BlankCmp },
    { path: 'register', component: RegisterForm },
    { path: 'aml', component: Aml },
    { path: 'parts', component: Parts },
    { path: 'dwgs', component: Dwgs }
];

export function advance(fixture: ComponentFixture<any>): void {
    tick();
    fixture.detectChanges();
}

export function createRoot(
    router: Router,
    componentType: any): ComponentFixture<any> 
    {
        const f = TestBed.createComponent(componentType);
        advance(f);
        (<any>router).initialNavigation();
        advance(f);
        return f;
    }

export function configureAppTests() {
    const dataServiceMock: DataServiceMock = new DataServiceMock();

    TestBed.configureTestingModule({
        imports: [
            { // TODO RouterTestingModule.withRoutes coming soon
                ngModule: RouterTestingModule,
                providers: [provideRoutes(routerConfig)]
            },
            TestModule
        ],
        providers: [
            dataServiceMock.getProviders(),
            {
                provide: ActivatedRoute,
                useFactory: (r: Router) => r.routerState.root, deps: [ Router ]
            },
            { provide: AppStore, useFactory: () => store },
            { provide: BASEPATH, useValue: '/dashboard/' }
        ]
    }).compileComponents();
}

@NgModule({
    imports: [
        RouterTestingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule.forRoot()
    ],
    declarations: [
        BlankCmp,
        RootCmp,
        LoginForm,
        RegisterForm,
        Aml,
        Parts,
        Dwgs
    ]
})
class TestModule {
}
