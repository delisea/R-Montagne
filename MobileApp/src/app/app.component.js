var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, NavParams } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MapPage } from '../pages/map/map';
import { AccountPage } from '../pages/account/account';
import { Events } from 'ionic-angular';
import { AuthService } from '../providers/auth-service/auth-service';
var MyApp = /** @class */ (function () {
    function MyApp(auth, events, navParams, platform, statusBar, splashScreen) {
        var _this = this;
        this.auth = auth;
        this.events = events;
        this.navParams = navParams;
        this.rootPage = 'LoginPage';
        this.logged = false;
        console.log(navParams.get('item'));
        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'Account', component: AccountPage, param: 0 }
        ];
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
            events.subscribe('log:change', function (state) {
                _this.logged = state;
                if (_this.logged) {
                    _this.auth.request("watch/read.php", {}).subscribe(function (data) {
                        console.log(data);
                        for (var _i = 0, _a = data.maps; _i < _a.length; _i++) {
                            var m = _a[_i];
                            _this.pages.push({ title: 'Map: ' + m.name, component: MapPage, param: m.idMap });
                        }
                    });
                }
            });
        });
    }
    MyApp.prototype.openPage = function (page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        console.log("move");
        this.nav.setRoot(page.component, {
            param: page.param
        });
    };
    MyApp.prototype.logout = function () {
        this.auth.logout();
    };
    __decorate([
        ViewChild(Nav),
        __metadata("design:type", Nav)
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Component({
            templateUrl: 'app.html'
        }),
        __metadata("design:paramtypes", [AuthService, Events, NavParams, Platform, StatusBar, SplashScreen])
    ], MyApp);
    return MyApp;
}());
export { MyApp };
//# sourceMappingURL=app.component.js.map