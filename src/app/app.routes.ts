import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/authentication.guard';
import { ChatView } from './features/chat-view/chat-view';

export const routes: Routes = [
  {
    path: '',
    component: ChatView,
    canActivate: [AuthGuard],
  },
];
