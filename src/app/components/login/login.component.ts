import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements AfterViewInit {
  @ViewChild(NavComponent) nav?: NavComponent;

  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      this.nav?.navItem([{
        nav: 2,
        routerLink: '/signup',
        name: 'Crear Cuenta',
        icon: 'person_add',
        lambda: () => {}
      }]);
    });
  }
}
