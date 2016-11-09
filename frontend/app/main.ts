import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { CmsAppModule } from './app.module';

platformBrowserDynamic().bootstrapModule(CmsAppModule)
  .catch(err => console.error(err));
