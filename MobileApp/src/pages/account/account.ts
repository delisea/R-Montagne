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
  isCP = false;
  pass1: string = '';
  pass2: string = '';

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

  cancel(){
    this.isRO = true;
    this.credentials = this.backUpCreds;
  }

save(){
  this.isRO = true;
  this.auth.request('user/update.php', {name: this.credentials.name, firstName: this.credentials.firstName, email: this.credentials.email, phone: this.credentials.phone, address: this.credentials.address}).subscribe(data => {
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
  this.isCP = true;
}

cancelPW(){
  this.isCP = false;
}

savePW(){
  this.isCP = false;
  if(this.pass1 != '' && this.pass1 === this.pass2){
    this.auth.request('user/updatepwd.php', {password: this.pass1}).subscribe(data => {
     console.log(this.credentials);
     console.log(data);
      if(data){
        //popup modification faite
      }
      else{
        // à raté
      }
    });
  }
  else{
    //popup raté
  }
  this.pass1 = '';
  this.pass2 = '';
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
