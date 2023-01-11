import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class CheckTokenService {
  constructor(
    private jwtHelper: JwtHelperService
  ) { }

  check(): boolean {
    const CURRENT_USER = sessionStorage.length === 0 ? null : JSON.parse(sessionStorage['currentUser'] || '{}');

    if (CURRENT_USER) {
      if (this.jwtHelper.isTokenExpired(CURRENT_USER.token)) {
        alert('El token a expirado. ❌');
        return false;
      } else
        return true;
    } else
      return false;
  }

  checkRole(): boolean {
    let encontrarRolAdministrador = false;
    const CURRENT_USER = sessionStorage.length === 0 ? null : JSON.parse(sessionStorage['currentUser'] || '{}');
    
    if (CURRENT_USER && CURRENT_USER.roles) {
      let rol: string[] = CURRENT_USER.roles;
      rol.forEach((e) => {
        if (e === 'ROLE_ADMIN')
          encontrarRolAdministrador = true;
      });

      if (!encontrarRolAdministrador)
        return false;
      else
        return true;
    } else
      return false;
  }
}
