import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { CmsAppModule } from './app.module';

import 'bootstrapcss';
import './css/materials.css';
import 'bootstrap';
import 'jquery';
import 'hammerjs';

platformBrowserDynamic().bootstrapModule(CmsAppModule)
  .catch(err => console.error(err));
