import { AuthService } from './../providers/auth-service/auth-service';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';

import { MyApp } from './app.component';
import { MapPage } from '../pages/map/map'

@NgModule({
  declarations: [
    MyApp,
    MapPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {})
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MapPage
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
