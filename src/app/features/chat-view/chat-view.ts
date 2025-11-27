import { HubConnectionState } from '@microsoft/signalr';
import { Component, HostListener } from '@angular/core';
import { SharedModule } from '../../shared/modules/shared.module';
import { NzSplitterModule } from 'ng-zorro-antd/splitter';
import { SignalrService } from '../../services/signalr.service';

@Component({
  selector: 'app-chat-view',
  imports: [SharedModule, NzSplitterModule],
  templateUrl: './chat-view.html',
  styleUrl: './chat-view.scss',
})
export class ChatView {
  listContact: any[] = [];
  selectedContact: any;

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
    public signalrService: SignalrService,
  ) {

  }

  ngOnInit() {
    this.userOnListener();
    this.userOffListener();
    this.getOnlineUsersListener();
    this.getMsgListener();

    this.signalrService.state$.subscribe(state => {
      if (state === HubConnectionState.Connected) {
        this.getOnlineUsers();
      }
    });
  }

  userOnListener(): void {
    this.signalrService.on("userOn", (contact: any) => {
      this.listContact.push(contact);
    });
  }

  userOffListener(): void {
    this.signalrService.on("userOff", (userId: any) => {
      this.listContact = this.listContact.filter((u: any) => u.userId != userId);
    });
  }

  getOnlineUsers(): void {
    this.signalrService.invoke("GetOnlineUsers")
      .catch(err => console.error(err));
  }

  getOnlineUsersListener(): void {
    this.signalrService.on("getOnlineUsersResponse", (onlineUsers: Array<any>) => {
      this.listContact = [...onlineUsers];      
    });
  }

  sendMsg(): void {
    const msgInfo: any = {
      // fromUserId: this.signalrService.meId,
      toUserId: this.listContact[0].userId,
      // fromConnectionId: this.signalrService.meConnection,
      toConnectionId: this.listContact[0].signalrId,
      msg: this.msg
    }
    this.signalrService.invoke("SendMsg", msgInfo)
      .then(() => {
        this.listMsg.push(msgInfo);
        this.msg = "";
      })
      .catch(err => console.error(err));
  }

  getMsgListener(): void {
    this.signalrService.on("sendMsgResponse", (msgInfo: any) => {
      this.listMsg.push(msgInfo);
    });
  }

  onSelectContact(contact: any) {
    this.selectedContact = contact;
  }

  @HostListener('window:keydown.escape')
  onEscapePress() {
    this.selectedContact = null;
  }
}
