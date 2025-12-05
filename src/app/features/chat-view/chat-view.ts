import { HubConnectionState } from '@microsoft/signalr';
import { Component, HostListener, signal } from '@angular/core';
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

  // Signals để lưu thông tin user từ localStorage
  username = signal<string | null>(this.getFromLocalStorage('username'));
  userId = signal<string | null>(this.getFromLocalStorage('id'));

  listMsg: any[] = [];

  msg!: string;

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
      senderId: this.userId(),
      receiverId: this.selectedContact.userId,
      content: this.msg
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

  getFromLocalStorage(key: string): string | null {
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const parsed = JSON.parse(userInfo);
        return parsed[key] || null;
      }
      return null;
    } catch {
      return null;
    }
  }

}
