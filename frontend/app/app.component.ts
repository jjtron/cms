import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {EventService} from './services/EventService';

@Component({
  selector: 'cms-app',
  styleUrls: [
    'app/css/styles.css',
    ''
  ],
  template: `
  <div>
    <router-outlet></router-outlet>
  </div>
  `
})

export class CmsApp {
    constructor(
        private router: Router,
        private eventt: EventService) {
    }
}
