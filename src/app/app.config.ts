import { APP_INITIALIZER, ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { KeycloakBearerInterceptor, KeycloakService } from 'keycloak-angular';
import { initializeKeycloak } from './core/configs/keycloak.config';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi';
import { IconDefinition } from '@ant-design/icons-angular';
import { NzConfig, provideNzConfig } from 'ng-zorro-antd/core/config';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { NZ_DATE_LOCALE, provideNzI18n, vi_VN } from 'ng-zorro-antd/i18n';
import { provideAnimations } from '@angular/platform-browser/animations';

registerLocaleData(vi);

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key]);

const ngZorroConfig: NzConfig = {
  theme: {
    primaryColor: '#781badff'
  },
  table: {
    nzBordered: true,
  },
  button: {
    nzSize: 'large',
  },
  image: {
    nzDisablePreview: 'true',
  },
  form: {
    nzNoColon: true,
  },
  datePicker: {},
  // empty: {
  //   nzDefaultEmptyContent: NoDataComponent,
  // },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true,
    },
    provideNzConfig(ngZorroConfig),
    provideNzIcons(icons),
    provideNzI18n(vi_VN),
    { provide: NZ_DATE_LOCALE, useValue: vi },
    { provide: LOCALE_ID, useValue: 'vi' },
  ]
};
