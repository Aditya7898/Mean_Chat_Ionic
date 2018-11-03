import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController
} from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { TokenProvider } from '../../providers/token/token';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  username: string;
  email: string;
  password: string;

  loading: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authProvider: AuthProvider,
    private alertCtrl: AlertController,
    private tokenProvider: TokenProvider,
    private loadingCtrl: LoadingController
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  RegisterUser() {
    this.showLoader();

    this.authProvider
      .RegisterUser(this.username, this.email, this.password)
      .subscribe(
        data => {
          this.tokenProvider.SetToken(data.token);
          setTimeout(() => {
            this.loading.dismiss();
            this.navCtrl.setRoot('TabsPage');
          }, 3000);
        },
        err => {
          setTimeout(() => {
            this.loading.dismiss();
            if (err.error.msg) {
              this.showAlert(err.error.msg[0].message);
            }
            if (err.error.message) {
              this.showAlert(err.error.message);
            }
          }, 3000);
        }
      );
  }

  showAlert(msg) {
    let alert = this.alertCtrl.create({
      title: 'sign up error',
      subTitle: `${msg}`,
      buttons: ['OK'],
      cssClass: 'alertCss'
    });
    alert.present();
  }

  showLoader() {
    this.loading = this.loadingCtrl.create({
      content: 'Authenticating...',
      spinner: 'ios'
    });
    this.loading.present();
  }
}
