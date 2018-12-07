import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppMainModule } from './app/main.module';

enableProdMode();

platformBrowserDynamic().bootstrapModule(AppMainModule)
  .catch(err => console.error(err));
