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
import { HttpParams, HttpClient } from '@angular/common/http/';
//import { LoginPage } from '../../pages/login/login';
import { App } from 'ionic-angular';
import { Events } from 'ionic-angular';
import 'rxjs/add/operator/map';
var apiURL = 'http://closed.power-heberg.com/RMontagne/api/';
var response;
var User = /** @class */ (function () {
    function User(session, logInfos) {
        this.session = session;
        this.logInfos = logInfos;
    }
    return User;
}());
export { User };
var AuthService = /** @class */ (function () {
    function AuthService(events, app, httpClient) {
        this.events = events;
        this.app = app;
        this.httpClient = httpClient;
    }
    AuthService.prototype.login = function (credentials) {
        var _this = this;
        return Observable.create(function (observer) {
            _this.httpClient.post(apiURL + 'user/login.php', credentials).subscribe(function (data) {
                _this.logres = data;
                _this.currentUser = new User(_this.logres.session, _this.logres.user);
                console.log(_this.currentUser);
                observer.next(_this.logres.success === 1);
                _this.events.publish('log:change', _this.logres.success === 1);
                observer.complete();
            });
        });
    };
    AuthService.prototype.register = function (credentials) {
        var _this = this;
        return Observable.create(function (observer) {
            _this.httpClient.post(apiURL + 'user/register.php', credentials).subscribe(function (data) {
                _this.regres = data;
                observer.next(_this.regres.success === 1);
                observer.complete();
            });
        });
    };
    AuthService.prototype.getUserInfo = function () {
        return this.currentUser;
    };
    AuthService.prototype.request = function (url, params) {
        if (this.getUserInfo() === undefined) {
            this.logout();
            return Observable.create(function (observer) { });
        }
        var HTTPparams = new HttpParams();
        Object.keys(params).forEach(function (key) { return HTTPparams = HTTPparams.append(key, params[key]); });
        HTTPparams = HTTPparams.append('session', this.getUserInfo().session);
        return this.httpClient.post(apiURL + url, HTTPparams /*JSON.stringify(credentials)*/);
    };
    AuthService.prototype.logout = function () {
        var _this = this;
        if (this.getUserInfo()) {
            var params_1 = new HttpParams();
            params_1 = params_1.append('session', this.getUserInfo().session);
            return Observable.create(function (observer) {
                _this.httpClient.post(apiURL + 'user/logout.php', params_1).subscribe(function (data) {
                    _this.sucres = data;
                    observer.next(_this.sucres.success === 1);
                    observer.complete();
                });
            }).subscribe(function (data) {
                if (data) {
                    _this.events.publish('log:change', false);
                    _this.app.getRootNav().setRoot('LoginPage');
                }
            });
        }
        else
            this.app.getRootNav().setRoot('LoginPage');
    };
    AuthService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Events, App, HttpClient])
    ], AuthService);
    return AuthService;
}());
export { AuthService };
//# sourceMappingURL=auth-service.js.map