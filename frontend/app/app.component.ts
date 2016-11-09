import { Component, Inject } from '@angular/core';
import { Store } from 'redux';
import { AppStore } from './app-store';
import { AppState } from './reducers';

@Component({
  selector: 'cms-app',
  template: `
  <div>
    hello
  </div>
  `
})

export class CmsApp {
  constructor(@Inject(AppStore) private store: Store<AppState>) {

  }
}
