// import { PostWidget } from './features/home/post-widget/post-widget';
import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/authentication.guard';
import { ChatView } from './features/chat-view/chat-view';
import { HomeContent } from './features/home/home-content/home-content';

export const routes: Routes = [
  {
    path: '',
    component: HomeContent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/feed-view/feed-view').then(m => m.FeedView),
      },
    ],
  },
  {
    path: 'chat',
    component: ChatView,
    canActivate: [AuthGuard],
  },
];
