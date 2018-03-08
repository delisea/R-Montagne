var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AuthService } from './../providers/auth-service/auth-service';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http/';
import { MyApp } from './app.component';
import { MapPage } from '../pages/map/map';
import { AccountPage } from '../pages/account/account';
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        NgModule({
            declarations: [
                MyApp,
                MapPage,
                AccountPage,
            ],
            imports: [
                BrowserModule,
                HttpModule,
                IonicModule.forRoot(MyApp, {}),
                HttpClientModule
            ],
            bootstrap: [IonicApp],
            entryComponents: [
                MyApp,
                MapPage,
                AccountPage,
            ],
            providers: [
                StatusBar,
                SplashScreen,
                Geolocation,
                { provide: ErrorHandler, useClass: IonicErrorHandler },
                AuthService
            ]
        })
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map