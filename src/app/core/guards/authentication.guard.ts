import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

export const AuthGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  // 1. Kiểm tra Đăng nhập
  const authenticated = keycloakService.isLoggedIn();
  if (!authenticated) {
    // Nếu chưa đăng nhập, chuyển hướng đến Keycloak Login
    await keycloakService.login({
      redirectUri: window.location.origin + state.url,
    });
    return false;
  }

  // 2. Lấy Roles yêu cầu từ Route Data
  const requiredRoles: string[] = route.data['roles'] || [];

  if (requiredRoles.length === 0) {
    // Không yêu cầu role cụ thể, cho phép truy cập
    return true;
  }

  // 3. Kiểm tra Role
  const hasRequiredRole = requiredRoles.some(role =>
    keycloakService.isUserInRole(role)
  );

  if (hasRequiredRole) {
    return true;
  } else {
    // Chuyển hướng đến trang Access Denied
    return router.navigate(['/access-denied']);
  }
};