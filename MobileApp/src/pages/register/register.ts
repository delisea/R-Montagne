import { Component } from '@angular/core';
import { NavController, AlertController, IonicPage } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HttpParams, HttpClient } from '@angular/common/http/';


@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  createSuccess = false;
  registerCredentials = { name: '', firstName: '', email: '', phone: '', address: '', username: '', password: '' };
  isRescue = false;

  constructor(private nav: NavController, private auth: AuthService, private alertCtrl: AlertController) { }

  public register() {
    /*
    this.auth.register(this.registerCredentials).subscribe(success => {
      if (success) {
        this.createSuccess = true;
        this.showPopup("Success", "Account created.");
      } else {
        this.showPopup("Error", "Problem creating account.");
      }
    },
      error => {
        this.showPopup("Error", error);
      });
    */
      let params = new HttpParams();
      params = params.append('name', this.registerCredentials.name);
      params = params.append('firstName', this.registerCredentials.firstName);
      params = params.append('email', this.registerCredentials.email);
      params = params.append('phone', this.registerCredentials.phone);
      params = params.append('address', this.registerCredentials.address);
      params = params.append('username', this.registerCredentials.username);
      params = params.append('password', this.registerCredentials.password);
      params = params.append('rescuer', String(this.isRescue));
      this.auth.register(params).subscribe(data => {
        if(data)
          this.nav.setRoot('LoginPage');
        else{
          //popup à faire pour dire que pas bon
        }
        /* else {
          this.showError("Access Denied");
        }*/
      }, error => {
            console.log(error);
      });
  }

  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            if (this.createSuccess) {
              this.nav.popToRoot();
            }
          }
        }
      ]
    });
    alert.present();
  }
}
