import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { createStore, Store, compose, StoreEnhancer } from 'redux';
import { AppStore } from './app-store';
import { AppState, default as reducer} from './reducers';

import { CmsApp } from './app.component';

let devtools: StoreEnhancer<AppState> =
  window['devToolsExtension'] ?
  window['devToolsExtension']() : f => f;

let store: Store<AppState> = createStore<AppState>(
  reducer,
  compose(devtools)
);

@NgModule({
  imports: [ BrowserModule, FormsModule ],
  declarations: [
    CmsApp
    ],
  providers: [
    { provide: AppStore, useFactory: () => store } ],
  bootstrap: [ CmsApp ]
})

export class CmsAppModule { }
