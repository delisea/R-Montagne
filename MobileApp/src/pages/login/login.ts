import { Component } from '@angular/core';
import { NavController, LoadingController, Loading, IonicPage, AlertController, Platform } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HttpParams } from '@angular/common/http/';
import { ToastController } from 'ionic-angular';
import { Firebase } from '@ionic-native/firebase';
//import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { LocalNotifications } from '@ionic-native/local-notifications';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading: Loading;
  registerCredentials = { username: '', password: '' };

  constructor( private alertCtrl: AlertController,/* private fire: AngularFireAuth,*/ private nav: NavController, private auth: AuthService, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private firebase: Firebase) {}

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

  alert(message: string) {
    this.alertCtrl.create({
      title : 'Info!',
      subTitle: message,
      buttons: ['OK']
    }).present();
  }

  public login() {
      let params = new HttpParams();
      params = params.append('username', this.registerCredentials.username);
      params = params.append('password', this.registerCredentials.password);
      /*
      this.fire.auth.signInWithEmailAndPassword('gwenael.moreau2@gmail.com', this.registerCredentials.password).then(data => {
        console.log('grospenisçamarche',data);
        this.alert
      }).catch(
      error => {
        console.log('marche pas',error);
      });
      */
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
/*
  getNotif(){
    this.db.list('/alerts/1').push({
        username: 'grospenis3'
    });
    }
*/
/*
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
*/
}
