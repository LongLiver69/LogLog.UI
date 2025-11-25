import { HubConnectionState } from '@microsoft/signalr';
import { Component } from '@angular/core';
import { SharedModule } from '../../shared/modules/shared.module';
import { NzSplitterModule } from 'ng-zorro-antd/splitter';
import { SignalrService } from '../../services/signalr.service';
import { filter, take } from 'rxjs';

@Component({
  selector: 'app-chat-view',
  imports: [SharedModule, NzSplitterModule],
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
    this.signalrService.on("userOn", (newUser: any) => {
      this.listOnUser.push(newUser);
    });
  }

  userOffListener(): void {
    this.signalrService.on("userOff", (personId: any) => {
      this.listOnUser = this.listOnUser.filter((u: any) => u.userId != personId);
    });
  }

  getOnlineUsers(): void {
    this.signalrService.invoke("GetOnlineUsers")
      .catch(err => console.error(err));
  }

  getOnlineUsersListener(): void {
    this.signalrService.on("getOnlineUsersResponse", (onlineUsers: Array<any>) => {
      this.listOnUser = [...onlineUsers];
      console.log(this.listOnUser);
    });
  }

  sendMsg(): void {
    // const msgInfo: any = {
    //   fromUserId: this.signalrService.meId,
    //   toUserId: this.listOnUser[0].userId,
    //   fromConnectionId: this.signalrService.meConnection,
    //   toConnectionId: this.listOnUser[0].signalrId,
    //   msg: this.msg
    // }
    // this.signalrService.invoke("SendMsg", msgInfo)
    //   .then(() => {
    //     this.listMsg.push(msgInfo);
    //     this.msg = "";
    //   })
    //   .catch(err => console.error(err));
  }

  getMsgListener(): void {
    this.signalrService.on("sendMsgResponse", (msgInfo: any) => {
      this.listMsg.push(msgInfo);
    });
  }
}
