import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PostProvider } from '../../providers/post/post';
import moment from 'moment';
import io from 'socket.io-client';

@IonicPage()
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html'
})
export class CommentsPage {
  post: any;
  socket: any;
  commentsArray = [];
  tabElements: any;
  myComment: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private postProvider: PostProvider
  ) {
    this.tabElements = document.querySelector('.tabbar.show-tabbar');
    this.post = this.navParams.get('postData');
    this.socket = io('http://localhost:3000');
  }

  ionViewDidLoad() {
    this.GetSinglePost();

    this.socket.on('refreshPage', () => {
      this.GetSinglePost();
    });
  }

  ionViewWillEnter() {
    (this.tabElements as HTMLElement).style.display = 'none';
  }

  ionViewWillLeave() {
    (this.tabElements as HTMLElement).style.display = 'flex';
  }

  GetSinglePost() {
    this.postProvider.GetPost(this.post._id).subscribe(data => {
      this.commentsArray = data.post.comments;
    });
  }

  AddComment() {
    if (this.myComment) {
      this.postProvider.AddComment(this.post._id, this.myComment).subscribe(
        data => {
          this.myComment = '';
          this.socket.emit('refresh', {});
        },
        err => console.log(err)
      );
    }
  }

  Time(time) {
    return moment(time).fromNow();
  }
}
