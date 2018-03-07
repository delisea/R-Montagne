import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HttpParams, HttpClient } from '@angular/common/http/';
import { MapPage } from '../map/map';
import {App} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading: Loading;
  registerCredentials = { username: '', password: '' };

  constructor(private app:App, private nav: NavController, private auth: AuthService, private alertCtrl: AlertController, private loadingCtrl: LoadingController) { }

  public createAccount() {
    this.nav.push('RegisterPage');
  }

  public login() {
      let params = new HttpParams();
      params = params.append('username', this.registerCredentials.username);
      params = params.append('password', this.registerCredentials.password);
      this.auth.login(params).subscribe(data => {
        if(data)
          this.app.getRootNav().setRoot(MapPage);
        else{
          //popup à faire pour dire que pas bon
        }
      }, error => {
            console.log(error);
      });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError(text) {
    this.loading.dismiss();

    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }
}
