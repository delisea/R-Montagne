import { Component } from '@angular/core';
import { NavController, AlertController, IonicPage, ToastController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';

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
  isAL = false;
  pass1: string = '';
  pass2: string = '';
  licenseCurrent: null;
  licenseEndDate;
  licenseactive = false;
  license: null;

  constructor(private nav: NavController, private auth: AuthService, private alertCtrl: AlertController, private toastCtrl: ToastController) {
    this.auth.request('licenseTemp/get.php', {}).then(data => {
      if(data[0].endDate>Math.floor(Date.now() / 1000)){
        this.licenseEndDate= data[0].endDate;
        this.licenseactive = true;
      }
      this.licenseCurrent= data[0].idLicense;
    });
  }

  showToast(mes) {
    const toast = this.toastCtrl.create({
      message: mes,
      cssClass: 'toastaccount',
      position: 'bottom',
      duration: 5000
    });
    toast.present();
  }

  ngOnInit() {
    this.credentials = {}
    this.auth.getUserInfo().then((user) => {this.credentials = user.logInfos});
    this.backUpCreds = this.credentials;
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
  this.auth.request('user/update.php', {name: this.credentials.name, firstName: this.credentials.firstName, email: this.credentials.email, phone: this.credentials.phone, address: this.credentials.address}).then(data => {
    if(data){
      this.showToast('Information saved');
    }
    else{
      this.credentials = this.backUpCreds;
      this.showToast('Information not saved: wrong entry');
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
  if(this.pass1 != '' && this.pass1 === this.pass2){
    this.isCP = false;
    this.auth.request('user/updatepwd.php', {password: this.pass1}).then(data => {
      if(data){
        this.showToast('New password set');
      }
      else{
        this.showToast('Server error, password not changed');
      }
    });
  }
  else{
    this.showToast('Passwords must be the same and not null');
  }
  this.pass1 = '';
  this.pass2 = '';
}

addLicense(){
  this.isAL = true;
}

cancelLicense(){
  this.isAL = false;
}

activateLicense(){
  this.isAL = false;
  this.auth.request('licenseTemp/update.php', {license: this.license}).then(data => {
    if(data.success){
      this.showToast('License '+this.license+' activated');
      this.auth.request('licenseTemp/get.php', {}).then(data => {
        if(data[0].endDate>Math.floor(Date.now() / 1000)){
          this.licenseEndDate= data[0].endDate;
          this.licenseactive = true;
        }
        this.licenseCurrent= data[0].idLicense;
      });
      this.license = null;
    }
    else{
      this.showToast(data.message);
      this.license = null;
    }
  })
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
