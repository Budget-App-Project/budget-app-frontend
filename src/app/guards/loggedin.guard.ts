import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router){};
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      console.log('CanActivate notloggedin called');
    let isNotLoggedIn = !this.authService.isAuthenticated();
    if (isNotLoggedIn){
      return true
    } else {
      this.router.navigate(['/expenselist']);
      return false;
    }
  }
  
}