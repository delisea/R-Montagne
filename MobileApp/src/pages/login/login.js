var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, IonicPage } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
var LoginPage = /** @class */ (function () {
    function LoginPage(nav, auth, alertCtrl, loadingCtrl) {
        this.nav = nav;
        this.auth = auth;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.registerCredentials = { username: '', password: '' };
        this.flag = false;
    }
    LoginPage.prototype.createAccount = function () {
        this.nav.push('RegisterPage');
    };
    LoginPage.prototype.login = function () {
        var _this = this;
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
        if (this.flag)
            return;
        this.flag = true;
        this.auth.login(this.registerCredentials)..then(function (allowed) {
            if (allowed) {
                console.log("grospenis");
                _this.nav.setRoot('MenuPage');
            }
            else {
                _this.showError("Access Denied");
            }
        });
    };
    LoginPage.prototype.showLoading = function () {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...',
            dismissOnPageChange: true
        });
        this.loading.present();
    };
    LoginPage.prototype.showError = function (text) {
        this.loading.dismiss();
        var alert = this.alertCtrl.create({
            title: 'Fail',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present(prompt);
    };
    LoginPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-login',
            templateUrl: 'login.html',
        }),
        __metadata("design:paramtypes", [NavController, AuthService, AlertController, LoadingController])
    ], LoginPage);
    return LoginPage;
}());
export { LoginPage };
//# sourceMappingURL=login.js.map