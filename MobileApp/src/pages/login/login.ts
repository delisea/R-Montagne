import { Component } from '@angular/core';
import { NavController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HttpParams } from '@angular/common/http/';
import { ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading: Loading;
  registerCredentials = { username: '', password: '' };

  constructor(private nav: NavController, private auth: AuthService, private loadingCtrl: LoadingController, private toastCtrl: ToastController) {
    this.auth.relog();
  }

  showToast() {
    const toast = this.toastCtrl.create({
      message: 'Login or Password incorrect',
      cssClass: 'toastlogin',
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }

  public createAccount() {
    this.nav.push('RegisterPage');
  }

  public login() {
      let params = new HttpParams();
      params = params.append('username', this.registerCredentials.username);
      params = params.append('password', this.registerCredentials.password);
      this.auth.login(params).subscribe(data => {
        if(data) {
        }
        else{
          this.showToast();
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
}
