import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RouterModule } from '@angular/router';
import { routes } from './routes';

import { createStore, Store, compose, StoreEnhancer } from 'redux';
import { AppStore } from './app-store';
import { AppState, default as reducer} from './reducers';

import { CmsApp } from './app.component';
import { DataService } from './services/DataService';
import { LoginForm } from './components/login/LoginForm';
import { RegisterForm } from './components/login/RegisterForm';
import { EventService } from './services/EventService';
import { DashboardModule } from './components/dashboard/DashboardModule';

import { MaterialModule } from '@angular/material';

import { LocationStrategy, HashLocationStrategy } from '@angular/common';

let devtools: StoreEnhancer<AppState> =
  window['devToolsExtension'] ?
  window['devToolsExtension']() : f => f;

let store: Store<AppState> = createStore<AppState>(
  reducer,
  compose(devtools)
);

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    DashboardModule,
    MaterialModule.forRoot()
    ],
  declarations: [
    CmsApp,
    LoginForm,
    RegisterForm
    ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    { provide: AppStore, useFactory: () => store },
    DataService,
    EventService
    ],
  bootstrap: [ CmsApp ]
})

export class CmsAppModule { }
