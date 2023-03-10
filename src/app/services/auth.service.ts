import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, shareReplay, tap } from 'rxjs/operators';
import { User } from 'src/assets/definitions';
import * as moment from 'moment';

@Injectable()

export class AuthService {
  constructor(private http: HttpClient) { }

  isAuthenticated(){
    return this.isLoggedIn();
  }

  login(email:string, password:string ) {
    return this.http.post<User>('/api/login', {email, password})
        // this is just the HTTP call, 
        // we still need to handle the reception of the token
        .pipe(tap((val) => val.idToken ? this.setSession(val) : alert('Invalid email or password')), shareReplay());
  }

  private setSession(authResult: User) {
    const expiresAt = moment().add(authResult.expiresIn,'second');

    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
  } 

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
  }

  public isLoggedIn() {
    const expiration = localStorage.getItem('expires_at');
    if (expiration === null) {
      return false;
    } else {
      const expiresAt = JSON.parse(expiration);
      return moment().isBefore(moment(expiresAt));
    }
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

}
