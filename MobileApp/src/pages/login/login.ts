import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading: Loading;
  registerCredentials = { username: '', password: '' };
  flag: boolean=false;

  constructor(private nav: NavController, private auth: AuthService, private alertCtrl: AlertController, private loadingCtrl: LoadingController) { }

  public createAccount() {
    this.nav.push('RegisterPage');
  }

  public login() {
    /*
    this.showLoading()
    this.auth.login(this.registerCredentials).then(allowed => {
      if (allowed) {
        this.nav.setRoot('MenuPage');
      } else {
        this.showError("Access Denied");
      }
    },
      error => {
        this.showError(error);
      });
      */
      if(this.flag)
        return;
      this.flag= true;
      this.auth.login(this.registerCredentials).subscribe(data => {
        console.log(data);
        if(true){
          console.log("grospenis");
          this.nav.setRoot('MenuPage');
        }/* else {
          this.showError("Access Denied");
        }*/
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
