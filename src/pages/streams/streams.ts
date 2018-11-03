import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController
} from 'ionic-angular';
import { PostProvider } from '../../providers/post/post';
import moment from 'moment';
import io from 'socket.io-client';
import _ from 'lodash';
import { TokenProvider } from '../../providers/token/token';

@IonicPage()
@Component({
  selector: 'page-streams',
  templateUrl: 'streams.html'
})
export class StreamsPage {
  stream: any;
  socket: any;
  user: any;
  streamsArray = [];
  topStreamsArray = [];

  constructor(
    public navCtrl: NavController,
    private postProvider: PostProvider,
    public navParams: NavParams,
    private tokenProvider: TokenProvider,
    private modalCtrl: ModalController
  ) {
    this.stream = 'post';
    this.socket = io('http://localhost:3000');
  }

  ionViewDidLoad() {
    this.GetAllPosts();
    this.socket.on('refreshPage', () => {
      this.GetAllPosts();
    });
    this.tokenProvider.GetPayload().then(value => {
      this.user = value;
    });
  }

  GetAllPosts() {
    this.postProvider.GetAllPosts().subscribe(
      data => {
        console.log(data);
        this.streamsArray = data.posts;
        this.topStreamsArray = data.top;
      },
      err => {
        if (err.error.token === null) {
          this.tokenProvider.DeleteToken();
          this.navCtrl.setRoot('LoginPage');
        }
      }
    );
  }

  LikePost(post) {
    console.log(post);
    this.postProvider.AddLike(post).subscribe(data => {
      this.socket.emit('refresh', {});
    });
  }

  AddComment(post) {
    this.navCtrl.push('CommentsPage', { postData: post });
  }

  Time(time) {
    return moment(time).fromNow();
  }

  checkInLikesArray(arr, username) {
    return _.some(arr, { username: username });
  }

  PostModal() {
    let modal = this.modalCtrl.create('PostPage');
    modal.present();
  }
}
