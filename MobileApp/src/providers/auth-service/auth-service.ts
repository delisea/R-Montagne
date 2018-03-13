import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { HttpParams, HttpClient } from '@angular/common/http/';
import { App, Platform } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { Storage } from '@ionic/storage';

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
  rescuer: boolean;
  admin: boolean;
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

  constructor(private storage: Storage, public db: AngularFireDatabase, private localNotifications: LocalNotifications, private plt: Platform, public events: Events, private app:App, public httpClient: HttpClient) {
    this.plt.ready().then((rdy) => {
      this.localNotifications.on('click', (notification, state) => {
        console.log(notification);
        //let params = JSON.parse(notification.data);
        let params = notification.data;
        this.events.publish('alert:pop', params.map, params.id_tracker);
      });
    });
  }

  scheduleSingleNotif(alert){
    // Schedule a single notification
    this.localNotifications.schedule({
      id : 1,
      title: 'Alert Detected',
      text: 'One Tracker switched to alert mode',
      icon: 'assets/imgs/logo',
      data: { map: alert.map, id_tracker: alert.id_tracker }
    });
  }

  public login(credentials): Observable<Boolean> {
    return Observable.create(observer => {
      this.httpClient.post<LogResponse>(apiURL+'user/login.php', credentials).subscribe(data => {
        this.logres = data;
        this.currentUser = new User(this.logres.session, this.logres.user);
        console.log(this.currentUser);
        observer.next(this.logres.success === 1);
        if(this.logres.success === 1)
          this.storage.set('user', JSON.stringify(this.currentUser));
        this.initNotif();
        if(this.logres.success === 1)
          this.events.publish('log:change', this.logres.success === 1);
        observer.complete();
      });
    });
  }

  public initNotif(){
    var alert=undefined;
    this.db.object('/alerts/2').subscribe(data => {// /1
      Object.keys(data).forEach(function(key,index) {
        console.log(data[key]);
        if(alert===undefined || alert.time<data[key].time){
          alert = data[key];
        }
      });
      if(alert!==undefined){
        console.log(alert);
        this.scheduleSingleNotif(alert);
      }
    });
  }

  public async relog() {
    if((await this.getUserInfo()) === null)
      return;
    this.initNotif();
    this.events.publish('log:change', 1);
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

  public async getUserInfo() : Promise<User> {
    if(this.currentUser === undefined) {
      this.currentUser = JSON.parse(await this.storage.get('user'));
    }
    return this.currentUser;
  }

  public async request(url, params): Promise<any> {
    if((await this.getUserInfo()) === null) {
      this.logout();
      return Observable.create(observer => {})
    }

    let HTTPparams = new HttpParams();
    Object.keys(params).forEach(key => HTTPparams = HTTPparams.append(key, params[key]));
    HTTPparams = HTTPparams.append('session', (await this.getUserInfo()).session);
    return await this.httpClient.post<any>(apiURL+url, HTTPparams/*JSON.stringify(credentials)*/).toPromise().then(async (data) => {
      if(!(data.success === undefined) && data.success == 0 && !(data.message === undefined) && data.message === "Invalid session") {
        await this.storage.remove('user');console.log("x");console.log(this.currentUser);
        this.currentUser = undefined;
        this.events.publish('log:change', false);
      }
      return Promise.resolve(data);
    });
  }

  public async logout() {
    if(!(await this.getUserInfo() === null)) {
      let params = new HttpParams();
      params = params.append('session', (await this.getUserInfo()).session);
      return Observable.create(async observer => {
        await this.storage.remove('user');
        this.currentUser = undefined;
        this.httpClient.post<SucResponse>(apiURL+'user/logout.php', params).subscribe(data => {
          this.sucres = data;
          observer.next(1);
          observer.complete();
        });
      }).subscribe(data => {
        if(data) {
          this.events.publish('log:change', false);
        }
      });
    }
    else
      this.app.getRootNav().setRoot('LoginPage');
  }

}
