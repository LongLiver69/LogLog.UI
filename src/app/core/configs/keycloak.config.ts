
import { KeycloakService } from 'keycloak-angular';
import { environment } from '../../../environments/environment';

export function initializeKeycloak(keycloakService: KeycloakService) {
  return () =>
    keycloakService.init({
      config: environment.keycloakConfig,
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/silent-check-sso.html',
      },
      bearerExcludedUrls: ['/assets'],
      // enableBearerInterceptor: true,
    }).then(() => {
      console.log('Keycloak initialized successfully');
    }).catch(err => {
      console.error('Keycloak initialization failed', err);
    });
}