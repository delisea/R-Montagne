var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
var apiURL = 'http://closed.power-heberg.com/RMontagne/api/user/';
var User = /** @class */ (function () {
    function User(name, username) {
        this.name = name;
        this.username = username;
    }
    return User;
}());
export { User };
var AuthService = /** @class */ (function () {
    function AuthService(http) {
        this.http = http;
    }
    /*
      public login(credentials) {
        if (credentials.username === null) {
          return Observable.throw("Please insert credentials");
        } else {
          return Observable.create(observer => {
            // At this point make a request to your backend to make a real check!
            let access = (credentials.username === "username");
            this.currentUser = new User('Simon', 'saimon@devdactic.com');
            observer.next(access);
            observer.complete();
          });
        }
      }
      */
    AuthService.prototype.login = function (credentials) {
        /*
         return new Promise((resolve, reject) => {
         let headers = new Headers();
         headers.append('Content-Type', 'application/json');
 
         this.http.post(apiURL+'findbyusername.php', JSON.stringify(credentials), {headers: headers})
           .subscribe(res => {
             resolve(res.json());
           }, (err) => {
             reject(err);
           });
           */
        console.log(JSON.stringify(credentials));
        return this.http.post(apiURL + 'findbyusername.php', JSON.stringify(credentials));
    };
    AuthService.prototype.register = function (credentials) {
        if (credentials.username === null || credentials.password === null) {
            return Observable.throw("Please insert credentials");
        }
        else {
            // At this point store the credentials to your backend!
            return Observable.create(function (observer) {
                observer.next(true);
                observer.complete();
            });
        }
    };
    AuthService.prototype.getUserInfo = function () {
        return this.currentUser;
    };
    AuthService.prototype.logout = function () {
        var _this = this;
        return Observable.create(function (observer) {
            _this.currentUser = null;
            observer.next(true);
            observer.complete();
        });
    };
    AuthService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Http])
    ], AuthService);
    return AuthService;
}());
export { AuthService };
//# sourceMappingURL=auth-service.js.map