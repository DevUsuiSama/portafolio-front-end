import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class GuardGuard implements CanActivate {

  constructor(
    private authentication: AuthenticationService,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let currentUser = this.authentication.authenticatedUser;
    if (currentUser && currentUser.token) {
      if (this.jwtHelper.isTokenExpired(currentUser.token)) {
        alert('El token a expirado. ❌');
        this.router.navigate(['/login']);
        return false;
      } else
        return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

}
