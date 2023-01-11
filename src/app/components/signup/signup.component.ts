import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass']
})
export class SignupComponent implements AfterViewInit {
  @ViewChild(NavComponent) nav?: NavComponent;

  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      this.nav?.navItem([{
        nav: 2,
        routerLink: '/login',
        name: 'Iniciar Sesión',
        icon: 'login',
        lambda: () => {}
      }]);
    });
  }
}
