import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const idToken = localStorage.getItem("id_token");
    if (this.authService.isLoggedIn()) {
      const cloned = req.clone({
        headers: req.headers.set("Authorization", idToken || 'none')
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
