import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PostProvider } from '../../providers/post/post';
import io from 'socket.io-client';
import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html'
})
export class PostPage {
  post: string;
  socket: any;
  image: any;
  constructor(
    public navCtrl: NavController,
    private postProvider: PostProvider,
    public navParams: NavParams,
    private camera: Camera
  ) {
    this.socket = io('http://localhost:3000');
  }

  ionViewDidLoad() {}

  GoBack() {
    this.navCtrl.pop();
  }

  AddPost() {
    if (!this.post) {
      return;
    }
    let body;
    if (!this.image) {
      body = {
        post: this.post
      };
    } else {
      body = {
        post: this.post,
        image: this.image
      };
    }
    this.postProvider.AddPost(body).subscribe(data => {
      console.log(data);
      this.post = '';
      this.socket.emit('refresh', {});
    });
  }

  SelectImage() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      correctOrientation: true,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 300,
      targetHeight: 300
    };
    this.camera.getPicture(options).then(
      img => {
        console.log(img);
        this.image = 'data:image/jpeg;base64,' + img;
      },
      err => console.log(err)
    );
  }
}
