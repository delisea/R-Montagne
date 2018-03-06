import { Component } from '@angular/core';
import { NavController, AlertController, IonicPage } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HttpParams, HttpClient } from '@angular/common/http/';


@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
  createSuccess = false;
  credentials: any;
  backUpCreds: any;
  isRescue = false;
  isRO = true;

  constructor(private nav: NavController, private auth: AuthService, private alertCtrl: AlertController) { }

  logout() {
    this.auth.logout();
  }

  ngOnInit() {
    this.credentials = this.auth.getUserInfo().logInfos;
    this.backUpCreds = this.credentials;
    console.log(this.credentials);
  }

  modify(){
    this.isRO = false;
  }

save(){
  this.isRO = true;
  this.auth.updateInfos(this.credentials).subscribe(data => {
   console.log(this.credentials);
   console.log(data);
    if(data){
      //popup modification faite
    }
    else{
      this.credentials = this.backUpCreds;
    }
  });
}

isReadonly(){
  return this.isRO;
}

changePassword(){
  return;
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
