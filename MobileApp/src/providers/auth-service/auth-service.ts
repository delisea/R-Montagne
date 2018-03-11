import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { HttpParams, HttpClient } from '@angular/common/http/';
import { App } from 'ionic-angular';
import { Events } from 'ionic-angular';
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


  constructor(private storage: Storage, public events: Events, private app:App, public httpClient: HttpClient) {}

  public login(credentials): Observable<Boolean> {
    return Observable.create(observer => {
      this.httpClient.post<LogResponse>(apiURL+'user/login.php', credentials).subscribe(data => {
        this.logres = data;
        this.currentUser = new User(this.logres.session, this.logres.user);
        console.log(this.currentUser);
        observer.next(this.logres.success === 1);
        if(this.logres.success === 1)
          this.storage.set('user', JSON.stringify(this.currentUser));
        this.events.publish('log:change', this.logres.success === 1);
        observer.complete();
      });
    });
  }

  public async relog() {
    if((await this.getUserInfo()) === undefined)
      return;
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
    if((await this.getUserInfo()) === undefined) {
      this.logout();
      return Observable.create(observer => {})
    }

    let HTTPparams = new HttpParams();
    Object.keys(params).forEach(key => HTTPparams = HTTPparams.append(key, params[key]));
    HTTPparams = HTTPparams.append('session', (await this.getUserInfo()).session);
    return await this.httpClient.post<any>(apiURL+url, HTTPparams/*JSON.stringify(credentials)*/).toPromise();
  }

  public async logout() {
    if(this.getUserInfo()) {
      let params = new HttpParams();
      params = params.append('session', (await this.getUserInfo()).session);
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
