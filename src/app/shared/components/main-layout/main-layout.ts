import { Component } from '@angular/core';
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
  constructor(
    private keycloakService: KeycloakService,
  ) {
  }

  logout() {
    this.keycloakService.logout(window.location.origin + '/');
  }

  messageCount = 3;
  notificationCount = 12;

}

