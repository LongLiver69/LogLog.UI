import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'app-main-layout',
  imports: [RouterModule, NzBreadCrumbModule, NzIconModule, NzMenuModule, NzLayoutModule, NzInputModule, NzButtonModule, NzBadgeModule, NzDropDownModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  userInfo = signal<any>(null);

  constructor(
    private keycloakService: KeycloakService,
  ) {
    try {
      const token = this.keycloakService.getKeycloakInstance().tokenParsed as any;
      const userInfo = {
        id: token?.sub,
        username: token?.preferred_username,
        email: token?.email,
        name: token?.name,
      };
      this.userInfo.set(userInfo);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } catch (error) {
      console.error('Error getting user info:', error);
    }
  }

  logout() {
    this.keycloakService.logout(window.location.origin + '/');
  }
  
}

