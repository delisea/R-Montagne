import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { Http, Headers } from '@angular/http';
import { HttpParams, HttpClient } from '@angular/common/http/';

import 'rxjs/add/operator/map';

let apiURL = 'http://closed.power-heberg.com/RMontagne/api/'
let response: object;
export class User {
  name: string;
  username: string;
  session: string;

  constructor(name: string, username: string, session: string) {
    this.name = name;
    this.username = username;
    this.session = session;
  }
}

export interface LogResponse{
  session: string;
  success: number;
  user: {
    name: string;
    firstName: string;
    username: string;
    email: string;
    phone: string;
    address: string;
    rescuer: number;
  }
}

export interface RegResponse{
  success: number;
  user: {
    name: string;
    firstname: string;
    email: string;
    phone: string;
    address: string;
    username: string;
  }
}

@Injectable()
export class AuthService {
  currentUser: User;
  logres: LogResponse;
  regres: RegResponse;


  constructor(public httpClient: HttpClient) {}
/*
  public login(credentials) {
    if (credentials.username === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        // At this point make a request to your backend to make a real check!
        let access = (credentials.username === "username");
        this.currentUser = new User('Simon', 'saimon@devdactic.com');
        observer.next(access);
        observer.complete();
      });
    }
  }
  */

    public login(credentials): Observable<Boolean> {
       /*
        return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.post(apiURL+'findbyusername.php', JSON.stringify(credentials), {headers: headers})
          .subscribe(res => {
            resolve(res.json());
          }, (err) => {
            reject(err);
          });
          */
          //console.log(JSON.stringify(credentials));
          // return this.http.post(apiURL+'user/findbyusername.php', JSON.stringify(credentials));
          console.log(credentials);
          /*
          let response = this.httpClient.post(apiURL+'user/findbyusername.php', credentials).subscribe(data => {
            callback(data.success == 1);
          });

          this.currentUser.session = null;
          return new Promise((resolve, reject) => {
            this.httpClient.post<LogResponse>(apiURL+'user/findbyusername.php', credentials).subscribe(data => {
              this.logres = data;
              resolve(this.logres.success === '1');
            }

          });
*/
          return Observable.create(observer => {
              this.httpClient.post<LogResponse>(apiURL+'user/login.php', credentials).subscribe(data => {
                this.logres = data;
                console.log('grospenis');
                console.log(this.logres);

                observer.next(this.logres.success === 1);
                console.log(this.logres);
                observer.complete();
              });
          });
  }


  public register(credentials) {
    /*
    if (credentials.username === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      // At this point store the credentials to your backend!
      return Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
    }*/
              return Observable.create(observer => {
              this.httpClient.post<RegResponse>(apiURL+'user/register.php', credentials).subscribe(data => {
                this.regres = data;
                console.log('grospenis');
                console.log(this.regres);

                observer.next(this.regres.success === 1);
                console.log(this.regres);
                observer.complete();
              });
          });
  }

  public getUserInfo() : User {
    return this.currentUser;
  }
/*
  public doPOST(url, message) {
    message = message.append('session', session);
    return this.httpClient.post(apiURL+url, message);
  }
*/
  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }
}
