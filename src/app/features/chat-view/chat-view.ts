import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-view',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './chat-view.html',
  styleUrl: './chat-view.scss',
})
export class ChatView {
  listOnUser: any = [];

  listMsg: any = [
    {
      fromUserId: 1,
      toUserId: 2,
      fromConnectionId: 999,
      toConnectionId: 888,
      msg: 'Hello'
    },
    {
      fromUserId: 2,
      toUserId: 1,
      fromConnectionId: 888,
      toConnectionId: 999,
      msg: 'Hi'
    }
  ];

  msg!: string;
  meId = 1;

  constructor(
    // public signalrService: SignalrService,
  ) {

  }

  sendMsg() {}

  logOut() {}
}
