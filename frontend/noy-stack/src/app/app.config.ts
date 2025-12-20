import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideApi} from './core/modules/openapi';
import {provideHttpClient} from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import {carFeature} from './core/car/car.feature';
import {provideEffects} from '@ngrx/effects';
import {CarEffects} from './core/car/car.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideApi("http://localhost:8080"),
    provideHttpClient(),
    provideStore({
      [carFeature.name]: carFeature.reducer,
    }),
    provideEffects(CarEffects),
  ]
};
