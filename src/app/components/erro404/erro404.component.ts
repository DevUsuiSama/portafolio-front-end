import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-erro404',
  templateUrl: './erro404.component.html',
  styleUrls: ['./erro404.component.sass']
})
export class Erro404Component implements AfterViewInit {
  @ViewChild(NavComponent) nav?: NavComponent;

  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      this.nav?.navItem([{
        nav: 2,
        routerLink: '/',
        name: 'Home',
        icon: 'home',
        lambda: () => { }
      }]);
    });
  }
}
