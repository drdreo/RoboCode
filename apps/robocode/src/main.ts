import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { LogLevel, Logger } from '@robo-code/utils';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

Logger.setLogLevel(LogLevel.DEBUG);

if (environment.production) {
  Logger.setLogLevel(LogLevel.WARN);
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
