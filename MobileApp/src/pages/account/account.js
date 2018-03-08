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
import { NavController, AlertController, IonicPage } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
var AccountPage = /** @class */ (function () {
    function AccountPage(nav, auth, alertCtrl) {
        this.nav = nav;
        this.auth = auth;
        this.alertCtrl = alertCtrl;
        this.createSuccess = false;
        this.isRescue = false;
        this.isRO = true;
        this.isCP = false;
        this.pass1 = '';
        this.pass2 = '';
    }
    AccountPage.prototype.ngOnInit = function () {
        this.credentials = this.auth.getUserInfo().logInfos;
        this.backUpCreds = this.credentials;
        console.log(this.credentials);
    };
    AccountPage.prototype.modify = function () {
        this.isRO = false;
    };
    AccountPage.prototype.cancel = function () {
        this.isRO = true;
        this.credentials = this.backUpCreds;
    };
    AccountPage.prototype.save = function () {
        var _this = this;
        this.isRO = true;
        this.auth.request('user/update.php', { name: this.credentials.name, firstName: this.credentials.firstName, email: this.credentials.email, phone: this.credentials.phone, address: this.credentials.address }).subscribe(function (data) {
            console.log(_this.credentials);
            console.log(data);
            if (data) {
                //popup modification faite
            }
            else {
                _this.credentials = _this.backUpCreds;
            }
        });
    };
    AccountPage.prototype.isReadonly = function () {
        return this.isRO;
    };
    AccountPage.prototype.changePassword = function () {
        this.isCP = true;
    };
    AccountPage.prototype.cancelPW = function () {
        this.isCP = false;
    };
    AccountPage.prototype.savePW = function () {
        var _this = this;
        this.isCP = false;
        if (this.pass1 != '' && this.pass1 === this.pass2) {
            this.auth.request('user/updatepwd.php', { password: this.pass1 }).subscribe(function (data) {
                console.log(_this.credentials);
                console.log(data);
                if (data) {
                    //popup modification faite
                }
                else {
                    // à raté
                }
            });
        }
        else {
            //popup raté
        }
        this.pass1 = '';
        this.pass2 = '';
    };
    AccountPage.prototype.showPopup = function (title, text) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [
                {
                    text: 'OK',
                    handler: function (data) {
                        if (_this.createSuccess) {
                            _this.nav.popToRoot();
                        }
                    }
                }
            ]
        });
        alert.present();
    };
    AccountPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-account',
            templateUrl: 'account.html',
        }),
        __metadata("design:paramtypes", [NavController, AuthService, AlertController])
    ], AccountPage);
    return AccountPage;
}());
export { AccountPage };
//# sourceMappingURL=account.js.map