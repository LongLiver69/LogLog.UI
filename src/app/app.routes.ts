// import { PostWidget } from './views/home/post-widget/post-widget';
import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/authentication.guard';
import { ChatView } from './views/chat-view/chat-view';
import { HomeContent } from './views/home/home-content/home-content';
import { UploadAvatar } from './shared/components/upload-avatar/upload-avatar';

export const routes: Routes = [
  {
    path: '',
    component: HomeContent,
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
    component: ChatView,
    canActivate: [AuthGuard],
  },
  {
    path: 'upload-avatar',
    component: UploadAvatar,
    canActivate: [AuthGuard],
  },
];
