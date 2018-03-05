import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { Http, Headers } from '@angular/http';
import { HttpParams, HttpClient } from '@angular/common/http/';

import 'rxjs/add/operator/map';

let apiURL = 'http://closed.power-heberg.com/RMontagne/api/'
let response: object;

export class User {
  session: string;
  logInfos: UserInfos;

  constructor( session: string, logInfos: UserInfos) {
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


  constructor(public httpClient: HttpClient) {}

    public login(credentials): Observable<Boolean> {
      return Observable.create(observer => {
        this.httpClient.post<LogResponse>(apiURL+'user/login.php', credentials).subscribe(data => {
          this.logres = data;
          this.currentUser = new User(this.logres.session, this.logres.user);
          console.log(this.currentUser);
          observer.next(this.logres.success === 1);
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
    let HTTPparams = new HttpParams();
    Object.keys(params).forEach(key => HTTPparams = HTTPparams.append(key, params[key]));
    HTTPparams = HTTPparams.append('session', this.getUserInfo().session);
    return this.httpClient.post<any>(apiURL+url, {}/*JSON.stringify(credentials)*/);
  }

  public logout() {
    let params = new HttpParams();
    params = params.append('session', this.getUserInfo().session);
    return Observable.create(observer => {
      console.log('grospenis');
      this.httpClient.post<SucResponse>(apiURL+'user/logout.php', params).subscribe(data => {
      this.sucres = data;
      observer.next(this.sucres.success === 1);
      console.log('grospenistamer');
      observer.complete();
    });
  });
}
}
