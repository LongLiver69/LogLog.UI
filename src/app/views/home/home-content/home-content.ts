import { Component, signal } from '@angular/core';
import { SharedModule } from '../../../shared/modules/shared.module';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home-content',
  imports: [SharedModule, RouterOutlet],
  templateUrl: './home-content.html',
  styleUrl: './home-content.scss',
})
export class HomeContent {
  userInfo = signal<any>({});

  ngOnInit(): void {
    this.userInfo.set(JSON.parse(localStorage.getItem('userInfo') || '{}'));
  }

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
