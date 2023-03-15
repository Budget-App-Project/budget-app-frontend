import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, tap } from 'rxjs/operators';
import { User, SignUpUser } from 'src/assets/definitions';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Injectable()

export class AuthService {
  constructor(private http: HttpClient, private router: Router) { }

  isAuthenticated(){
    return this.isLoggedIn();
  }

  login(email: string, password: string ) {
    return this.http.post<User>('/api/login', { email, password })
        // this is just the HTTP call, 
        // we still need to handle the reception of the token
        .pipe(tap((val) => val.idToken ? this.setSession(val) : alert("Incorrect email or password")), shareReplay());
  }

  signup(email: string, password: string, name: string) {
    return this.http.post<SignUpUser>('api/signup', {email, name, password})
      .pipe(tap(
        (val) => {
          if (val.idToken) {
            this.setSession(val);
          }
        }))
  }

  private setSession(authResult: User) {
    const expiresAt = moment().add(authResult.expiresIn,'second');

    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
  } 

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    this.router.navigateByUrl("/");
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

  validateLogin(email: string, password: string) {
    if (email.includes('@') && email.includes('.') && password.length > 5) {
      return true;
    } else {
      return false;
    }
  }

  validateSignUp(email: string, name: string, password: string) {
    if (email.includes('@') && email.includes('.') && password.length > 5 && name.length > 0) {
      return true;
    } else {
      return false
    }
  }

}
