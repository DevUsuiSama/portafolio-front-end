import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CheckTokenService } from 'src/app/service/check-token.service';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.sass']
})
export class PrivacyPolicyComponent implements AfterViewInit {
  @ViewChild(NavComponent) nav?: NavComponent;

  constructor(
    private checkToken: CheckTokenService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      if (this.checkToken.check()) {
        this.nav?.navItem([{
          nav: 1,
          routerLink: '/',
          name: 'Home',
          icon: 'home',
          lambda: () => { }
        }, {
          nav: 2,
          routerLink: '',
          name: 'Cerrar Sesión',
          icon: 'logout',
          lambda: () => {
            this.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
              this.router.navigate(['']).then(() => {
                this.authenticationService.delete();
                sessionStorage.clear();
              })
            })
          }
        }]);
      } else {
        this.nav?.navItem([{
          nav: 1,
          routerLink: '/',
          name: 'Home',
          icon: 'home',
          lambda: () => { }
        }, {
          nav: 2,
          routerLink: '/login',
          name: 'Iniciar Sesión',
          icon: 'login',
          lambda: () => { }
        }, {
          nav: 2,
          routerLink: '/signup',
          name: 'Crear Cuenta',
          icon: 'person_add',
          lambda: () => { }
        }]);
      }
    });
  }
}
