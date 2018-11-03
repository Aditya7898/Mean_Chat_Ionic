import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  AlertController
} from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { TokenProvider } from '../../providers/token/token';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  username: string;
  password: string;
  loading: any;
  tabElements: any;

  constructor(
    public navCtrl: NavController,
    private tokenProvider: TokenProvider,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public navParams: NavParams,
    private authProvider: AuthProvider
  ) {
    this.tabElements = document.querySelector('.tabbar.show-tabbar');
  }

  ionViewDidLoad() {
    if (this.tabElements) {
      (this.tabElements as HTMLElement).style.display = 'none';
    }
  }

  LoginUser() {
    console.log(this.username);
    console.log(this.password);
    this.showLoader();
    this.authProvider.LoginUser(this.username, this.password).subscribe(
      data => {
        console.log(data);
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
            this.showErrorAlert(err.error.msg[0].message);
          }
          if (err.error.message) {
            this.showErrorAlert(err.error.message);
          }
        }, 3000);
      }
    );
  }

  showErrorAlert(msg) {
    let alert = this.alertCtrl.create({
      title: 'Login Error',
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

  RegisterPage() {
    this.navCtrl.push('RegisterPage');
  }
}
