import { NgTemplateOutlet } from '@angular/common';
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
import { SignalrService } from '../../../services/signalr.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterModule, NzBreadCrumbModule, NzIconModule, NzMenuModule, NzLayoutModule, NzInputModule, NgTemplateOutlet, NzButtonModule, NzBadgeModule, NzDropDownModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  constructor(
    private keycloakService: KeycloakService,
    private signalrService: SignalrService,
  ) {
    // this.signalrService.start().catch(err => {
    //   console.error('Error starting SignalR connection in MainLayoutComponent:', err);
    // });
  }

  logout() {
    this.keycloakService.logout(window.location.origin + '/');
  }

  messageCount = 3;
  notificationCount = 12;

  menus = [
    {
      level: 1,
      title: 'Bạn bè',
      icon: 'mail',
      open: true,
      selected: false,
      disabled: false
    },
    {
      level: 1,
      title: 'Kỷ niệm',
      icon: 'team',
      open: false,
      selected: false,
      disabled: false,
    },
    {
      level: 1,
      title: 'Đã lưu',
      icon: 'team',
      open: false,
      selected: false,
      disabled: false,
    },
    {
      level: 1,
      title: 'Nhóm',
      icon: 'team',
      open: false,
      selected: false,
      disabled: false,
    },
    {
      level: 1,
      title: 'Video',
      icon: 'team',
      open: false,
      selected: false,
      disabled: false,
    },
    {
      level: 1,
      title: 'Marketplace',
      icon: 'team',
      open: false,
      selected: false,
      disabled: false,
    },
    {
      level: 1,
      title: 'Xem thêm',
      icon: 'team',
      open: false,
      selected: false,
      disabled: false
    }
  ];

}

