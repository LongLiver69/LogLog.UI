import { Component } from '@angular/core';
import { PostWidget } from "../post-widget/post-widget";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NgTemplateOutlet } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home-content',
  imports: [RouterOutlet, NzBreadCrumbModule, NzIconModule, NzMenuModule, NzLayoutModule, NzInputModule, NgTemplateOutlet, NzButtonModule, NzBadgeModule, NzDropDownModule],
  templateUrl: './home-content.html',
  styleUrl: './home-content.scss',
})
export class HomeContent {
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
