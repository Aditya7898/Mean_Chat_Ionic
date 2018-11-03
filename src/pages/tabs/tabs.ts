import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { TokenProvider } from '../../providers/token/token';
import { UsersProvider } from '../../providers/users/users';
import _ from 'lodash';
import io from 'socket.io-client';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tabRoot1 = 'StreamsPage';
  tabRoot2 = 'ChatListPage';
  tabRoot3 = 'HomePage';

  socket: any;
  token: any;
  count = 0;
  messageCount = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private tokenProvider: TokenProvider,
    private usersProvider: UsersProvider
  ) {
    this.socket = io('http://localhost:3000');
  }

  ionViewDidLoad() {
    this.tokenProvider.GetPayload().then(res => {
      this.token = res;
      this.GetUser(this.token._id, this.token.username);
    });
  }

  GetUser(id, username) {
    this.usersProvider.getUserById(id).subscribe(data => {
      let msgArray = [];
      _.forEach(data.result.chatList, value => {
        const msg = value.msgId.message;
        _.forEach(msg, val => {
          if (val.isRead === false && val.receivername === username) {
            msgArray.push(val);
            this.messageCount = msgArray.length;
          }
        });
      });
    });
  }

  ClickTab() {
    this.socket.on('refreshPage', () => {
      this.tokenProvider.GetPayload().then(res => {
        this.token = res;
        this.GetUser(this.token._id, this.token.username);
      });

      this.messageCount -= 1;
      if (this.messageCount <= 0) {
        this.messageCount = null;
      }
    });
  }
}
