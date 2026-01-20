import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/authentication.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./views/home/home-content/home-content').then(m => m.HomeContent),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./views/feed-view/feed-view').then(m => m.FeedView),
      },
    ],
  },
  {
    path: 'chat',
    loadComponent: () => import('./views/chat-view/chat-view').then(m => m.ChatView),
    canActivate: [AuthGuard],
  },
  {
    path: 'upload-avatar',
    loadComponent: () => import('./shared/components/upload-avatar/upload-avatar').then(m => m.UploadAvatar),
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    loadComponent: () => import('./views/profile-view/profile-view').then(m => m.ProfileView),
    canActivate: [AuthGuard],
  },
];
