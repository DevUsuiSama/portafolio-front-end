import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CheckTokenService } from 'src/app/service/check-token.service';
import { FetchService } from 'src/app/service/fetch.service';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements AfterViewInit, OnInit {
  nombreDeUsuarios: string[] = [];
  loading: boolean = false;

  @ViewChild(NavComponent) nav?: NavComponent;

  constructor(
    private fetch: FetchService,
    private checkToken: CheckTokenService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.fetch.getServer('api/auth/get_all_usuario').subscribe({
      next: (res: any) => {
        this.loading = false;
        this.nombreDeUsuarios = res;
      },
      error: () => {
        this.loading = false;
        console.error('User: Request failed with error');
      },
      complete: () => {
        console.log('User: Request completed')
      }
    });
  }

  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      if (this.checkToken.check()) {
        if (this.checkToken.checkRole()) {
          this.nav?.navItem([{
            nav: 1,
            routerLink: '/privacy_policy',
            name: 'Política de Privacidad',
            icon: 'policy',
            lambda: () => { }
          }, {
            nav: 2,
            routerLink: '/panel',
            name: 'Panel Administrador',
            icon: 'admin_panel_settings',
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
            routerLink: '/privacy_policy',
            name: 'Política de Privacidad',
            icon: 'policy',
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
        }
      } else {
        this.nav?.navItem([{
          nav: 1,
          routerLink: '/privacy_policy',
          name: 'Política de Privacidad',
          icon: 'policy',
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
