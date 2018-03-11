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
import { Firebase } from '@ionic-native/firebase';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database-deprecated';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { MyApp } from './app.component';
import { MapPage } from '../pages/map/map';
import { MapAdminPage } from '../pages/mapAdmin/mapAdmin';
import { AccountPage } from '../pages/account/account';
import { TrackerPage } from '../pages/tracker/tracker';

  const firebaseAuth = {
    apiKey: "AIzaSyAy9HnosQMjkVvv-__6xvhW2L6RV0ZbQnc",
    authDomain: "r-montagne.firebaseapp.com",
    databaseURL: "https://r-montagne.firebaseio.com",
    projectId: "r-montagne",
    storageBucket: "r-montagne.appspot.com",
    messagingSenderId: "558740077803"
  };

@NgModule({
  declarations: [
    MyApp,
    MapPage,
    MapAdminPage,
    AccountPage,
    TrackerPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {}),
    HttpClientModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseAuth),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MapPage,
    MapAdminPage,
    AccountPage,
    TrackerPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    Firebase,
    LocalNotifications
  ]
})
export class AppModule {}
