import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { HttpParams, HttpClient } from '@angular/common/http/';
import { App, Platform } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';

import 'rxjs/add/operator/map';

let apiURL = 'http://closed.power-heberg.com/RMontagne/api/'

export class User {
  session: string;
  logInfos: UserInfos;

  constructor(session: string, logInfos: UserInfos) {
    this.session = session;
    this.logInfos = logInfos;
  }
}

export interface UserInfos{
  name: string;
  firstName: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  rescuer: number;
}

export interface LogResponse{
  session: string;
  success: number;
  user: UserInfos;
}

export interface RegResponse{
  success: number;
  user: UserInfos;
}

export interface SucResponse{
  success: number;
}

@Injectable()
export class AuthService {
  currentUser: User;
  logres: LogResponse;
  regres: RegResponse;
  sucres: SucResponse;

  map;
  id_tracker;
  timestamp;


  notifAlert = {
    id: 1,
    title: 'Alert Detected',
    text: 'One Tracker switched to alert mode',
    icon: 'assets/imgs/logo',
    data: { id_tracker: this.id_tracker, map: this.map, timestamp: this.timestamp }
  };

  constructor(public db: AngularFireDatabase, private localNotifications: LocalNotifications, private plt: Platform, public events: Events, private app:App, public httpClient: HttpClient) {
    this.plt.ready().then((rdy) => {
      this.localNotifications.on('click', (notification, state) => {
        console.log(notification);
        let params = JSON.parse(notification.data);
        this.events.publish('', 'alert:pop', params.id_tracker, params.map, params.timestamp);
      });
    });
  }

  scheduleSingleNotif(){
    // Schedule a single notification
    this.localNotifications.schedule(this.notifAlert);
  }

  public login(credentials): Observable<Boolean> {
    return Observable.create(observer => {
      this.httpClient.post<LogResponse>(apiURL+'user/login.php', credentials).subscribe(data => {
        this.logres = data;
        this.currentUser = new User(this.logres.session, this.logres.user);
        console.log(this.currentUser);
        observer.next(this.logres.success === 1);
        var alert=undefined;
        this.db.object('/alerts/1').subscribe(data => {
          Object.keys(data).forEach(function(key,index) {
            console.log(data[key]);
            if(alert===undefined || alert.time<data[key].time){
              alert = data[key];
            }
          });
          if(alert!==undefined){
            console.log(alert);
            this.scheduleSingleNotif();
          }
        });

        this.events.publish('log:change', this.logres.success === 1);
        observer.complete();
      });
    });
  }


  public register(credentials) {
    return Observable.create(observer => {
      this.httpClient.post<RegResponse>(apiURL+'user/register.php', credentials).subscribe(data => {
        this.regres = data;
        observer.next(this.regres.success === 1);
        observer.complete();
      });
    });
  }

  public getUserInfo() : User {
    return this.currentUser;
  }

  public request(url, params) {
    if(this.getUserInfo() === undefined) {
      this.logout();
      return Observable.create(observer => {})
    }

    let HTTPparams = new HttpParams();
    Object.keys(params).forEach(key => HTTPparams = HTTPparams.append(key, params[key]));
    HTTPparams = HTTPparams.append('session', this.getUserInfo().session);
    return this.httpClient.post<any>(apiURL+url, HTTPparams/*JSON.stringify(credentials)*/);
  }

  public logout() {
    if(this.getUserInfo()) {
      let params = new HttpParams();
      params = params.append('session', this.getUserInfo().session);
      return Observable.create(observer => {
        this.httpClient.post<SucResponse>(apiURL+'user/logout.php', params).subscribe(data => {
          this.sucres = data;
          observer.next(this.sucres.success === 1);
          observer.complete();
        });
      }).subscribe(data => {
        if(data) {
          this.events.publish('log:change', false);
          this.app.getRootNav().setRoot('LoginPage');
        }
      });
    }
    else
      this.app.getRootNav().setRoot('LoginPage');
  }

}
