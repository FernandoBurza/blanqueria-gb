import { enableProdMode, importProvidersFrom } from '@angular/core';


import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));


// if (environment.production) {
//   enableProdMode();
// }
// platformBrowserDynamic().bootstrapModule(BrowserModule)
//    .catch(err => console.error(err));
