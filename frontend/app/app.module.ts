import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
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
    DashboardModule
    ],
  declarations: [
    CmsApp,
    LoginForm,
    RegisterForm
    ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: AppStore, useFactory: () => store },
    DataService,
    EventService
    ],
  bootstrap: [ CmsApp ]
})

export class CmsAppModule { }
