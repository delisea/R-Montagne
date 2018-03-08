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
import { HttpParams } from '@angular/common/http/';
var RegisterPage = /** @class */ (function () {
    function RegisterPage(nav, auth, alertCtrl) {
        this.nav = nav;
        this.auth = auth;
        this.alertCtrl = alertCtrl;
        this.createSuccess = false;
        this.registerCredentials = { name: '', firstName: '', email: '', phone: '', address: '', username: '', password: '' };
        this.isRescue = false;
    }
    RegisterPage.prototype.register = function () {
        var _this = this;
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
        var params = new HttpParams();
        params = params.append('name', this.registerCredentials.name);
        params = params.append('firstName', this.registerCredentials.firstName);
        params = params.append('email', this.registerCredentials.email);
        params = params.append('phone', this.registerCredentials.phone);
        params = params.append('address', this.registerCredentials.address);
        params = params.append('username', this.registerCredentials.username);
        params = params.append('password', this.registerCredentials.password);
        params = params.append('rescuer', String(this.isRescue));
        this.auth.register(params).subscribe(function (data) {
            if (data)
                _this.nav.setRoot('LoginPage');
            else {
                //popup à faire pour dire que pas bon
            }
            /* else {
              this.showError("Access Denied");
            }*/
        }, function (error) {
            console.log(error);
        });
    };
    RegisterPage.prototype.showPopup = function (title, text) {
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
    RegisterPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-register',
            templateUrl: 'register.html',
        }),
        __metadata("design:paramtypes", [NavController, AuthService, AlertController])
    ], RegisterPage);
    return RegisterPage;
}());
export { RegisterPage };
//# sourceMappingURL=register.js.map