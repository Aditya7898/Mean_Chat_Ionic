import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsersProvider } from '../../providers/users/users';
import { TokenProvider } from '../../providers/token/token';
import moment from 'moment';
import _ from 'lodash';
import { MessageProvider } from '../../providers/message/message';
import io from 'socket.io-client';

@IonicPage()
@Component({
  selector: 'page-chat-list',
  templateUrl: 'chat-list.html'
})
export class ChatListPage {
  token: any;
  socket: any;
  chatList = [];

  constructor(
    public navCtrl: NavController,
    private userProvider: UsersProvider,
    private tokenProvider: TokenProvider,
    public navParams: NavParams,
    private messageService: MessageProvider
  ) {
    this.socket = io('http://localhost:3000');
  }

  ionViewDidLoad() {
    this.tokenProvider.GetPayload().then(tokenVal => {
      this.token = tokenVal;
      this.GetUser(this.token._id);
    });

    this.socket.on('refreshPage', () => {
      this.tokenProvider.GetPayload().then(tokenVal => {
        this.token = tokenVal;
        this.GetUser(this.token._id);
      });
    });
  }

  GetUser(id) {
    this.userProvider.getUserById(id).subscribe(data => {
      console.log(data);
      this.chatList = data.result.chatList;
    });
  }

  chatPage(chat) {
    this.navCtrl.push('ChatPage', {
      receiverId: chat.receiverId._id,
      receivername: chat.receiverId.username
    });

    this.messageService
      .MarkMessages(this.token.username, chat.receiverId.username)
      .subscribe(
        data => {
          this.socket.emit('refresh', {});
          console.log(data);
        },
        err => console.log(err)
      );
  }

  CheckIfFalse(arr, name) {
    let total = 0;
    _.forEach(arr, val => {
      if (val.isRead === false && val.receivername !== name) {
        total += 1;
      }
    });
    return total;
  }

  GetTime(time) {
    const todaysDate = new Date();
    const date = new Date(time);

    const d1 = moment(new Date(todaysDate));
    const d2 = moment(new Date(date));

    const d3 = d1.diff(d2, 'days');
    if (d3 == 0) {
      return moment(time).format('LT');
    } else {
      return moment(time).format('DD/MM/YYYY');
    }
  }
}
