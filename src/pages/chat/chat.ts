import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { MessageProvider } from '../../providers/message/message';
import { TokenProvider } from '../../providers/token/token';
import io from 'socket.io-client';
import { CaretEvent, EmojiEvent } from '@ionic-tools/emoji-picker';
import { UsersProvider } from '../../providers/users/users';
import _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {
  @ViewChild(Content)
  contentDiv: Content;

  tabElements: any;
  message: any;
  receiverName: any;
  receiverId: any;
  sender: any;
  msgArray = [];
  socket: any;
  receiver: any;

  //typing---
  typingMessage: any;
  typing = false;
  isOnline = false;

  public eventMock;
  public eventPosMock;
  public direction =
    Math.random() > 0.5
      ? Math.random() > 0.5
        ? 'top'
        : 'bottom'
      : Math.random() > 0.5
        ? 'right'
        : 'left';
  public toggled = false;
  public content = ' ';
  private _lastCaretEvent: CaretEvent;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private messageProvider: MessageProvider,
    private tokenProvider: TokenProvider,
    private userProvider: UsersProvider
  ) {
    this.tabElements = document.querySelector('.tabbar.show-tabbar');
    this.receiverName = this.navParams.get('receivername');
    this.receiverId = this.navParams.get('receiverId');

    this.socket = io('http://localhost:3000');
    this.GoToBottom();
  }

  ionViewDidLoad() {
    this.tokenProvider.GetPayload().then(value => {
      this.sender = value;
      this.GetAllMessages(this.sender._id, this.receiverId);

      const val = {
        room: 'global',
        user: this.sender.username
      };
      this.socket.emit('online', val);

      const params = {
        room1: this.sender.username,
        room2: this.receiverName
      };
      this.socket.emit('join chat', params);

      this.GetReceiverData();
    });

    this.socket.on('refreshPage', () => {
      this.tokenProvider.GetPayload().then(val => {
        this.sender = val;
        this.GetAllMessages(this.sender._id, this.receiverId);
        this.GoToBottom();
      });
    });

    this.SocketFunction();
  }

  goback() {
    this.navCtrl.pop();
  }

  ionViewWillEnter() {
    (this.tabElements as HTMLElement).style.display = 'none';
  }
  ionViewWillLeave() {
    (this.tabElements as HTMLElement).style.display = 'flex';
  }

  privateMessage() {
    if (!this.message) {
      return;
    }
    this.messageProvider
      .SendMessage(
        this.sender._id,
        this.receiverId,
        this.receiverName,
        this.message
      )
      .subscribe(
        data => {
          console.log(data);
        },
        err => console.log(err)
      );

    this.socket.emit('refresh', {});
    this.message = '';
  }

  GetAllMessages(senderId, receiverId) {
    this.messageProvider
      .GetAllMessages(senderId, receiverId)
      .subscribe(data => {
        console.log(data);
        this.msgArray = data.messages.message;
      });
  }

  GetReceiverData() {
    this.userProvider.getUserByName(this.receiverName).subscribe(data => {
      this.receiver = data.result;
      console.log(this.receiver);
    });
  }

  // toggle
  Toggled() {
    this.toggled = !this.toggled;
  }

  // AutoScroll
  GoToBottom() {
    setTimeout(() => {
      if (this.contentDiv._scroll) {
        this.contentDiv.scrollToBottom();
      }
    }, 500);
  }

  // typing
  IsTyping() {
    console.log('Is typing a message');
    this.socket.emit('start_typing', {
      sender: this.sender.username,
      receiver: this.receiverName
    });
    if (this.typingMessage) {
      clearTimeout(this.typingMessage);
    }
    this.typingMessage = setTimeout(() => {
      this.socket.emit('stop_typing', {
        sender: this.sender.username,
        receiver: this.receiverName
      });
    }, 1500);
  }

  // socket function for typing
  SocketFunction() {
    console.log('called');
    this.socket.on('is_typing', data => {
      if (data.sender === this.receiverName) {
        console.log('true');
        this.typing = true;
      }
    });

    this.socket.on('has_stopped_typing', data => {
      if (data.sender === this.receiverName) {
        this.typing = false;
      }
    });

    this.socket.on('usersOnline', data => {
      const result = _.indexOf(data, this.receiverName);
      if (result > -1) {
        this.isOnline = true;
      } else {
        this.isOnline = false;
      }
    });
  }

  // emoji
  // emoji picker methods
  handleSelection(event: EmojiEvent) {
    this.content =
      this.content.slice(0, this._lastCaretEvent.caretOffset) +
      event.char +
      this.content.slice(this._lastCaretEvent.caretOffset);
    this.eventMock = JSON.stringify(event);

    // console.log(this.content);
    this.message = this.content;
    this.content = '';
    this.toggled = !this.toggled;
  }

  handleCurrentCaret(event: CaretEvent) {
    this._lastCaretEvent = event;
    this.eventPosMock = `{ caretOffset : ${
      event.caretOffset
    }, caretRange: Range{...}, textContent: ${event.textContent} }`;
  }
}
