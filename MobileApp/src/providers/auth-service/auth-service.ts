import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/map';

let apiURL = 'http://closed.power-heberg.com/RMontagne/api/user/'
export class User {
  name: string;
  username: string;

  constructor(name: string, username: string) {
    this.name = name;
    this.username = username;
  }
}


@Injectable()
export class AuthService {
  currentUser: User;

  constructor(public http: Http) {}
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

    public login(credentials) {
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
          console.log(JSON.stringify(credentials));
          return this.http.post(apiURL+'findbyusername.php', JSON.stringify(credentials));
  }


  public register(credentials) {
    if (credentials.username === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      // At this point store the credentials to your backend!
      return Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }

  public getUserInfo() : User {
    return this.currentUser;
  }

  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }
}
