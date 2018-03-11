import { AuthService } from './../providers/auth-service/auth-service';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http/';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { MapPage } from '../pages/map/map';
import { MapAdminPage } from '../pages/mapAdmin/mapAdmin';
import { AccountPage } from '../pages/account/account';

@NgModule({
  declarations: [
    MyApp,
    MapPage,
    MapAdminPage,
    AccountPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {}),
    HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MapPage,
    MapAdminPage,
    AccountPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService
  ]
})
export class AppModule {}
