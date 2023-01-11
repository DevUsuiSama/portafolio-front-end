import { Component, TemplateRef, ViewEncapsulation } from '@angular/core';
import { NgbOffcanvas, NgbOffcanvasConfig, NgbOffcanvasRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NavBar } from '../../models/navbar';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class NavComponent {
  result?: NgbOffcanvasRef;
  nav1?: boolean;
  nav2?: boolean;
  btncanvas?: boolean;
  navbar?: NavBar[];

  constructor(
    config: NgbOffcanvasConfig,
    private offcanvasService: NgbOffcanvas,
    router: Router
  ) {
    config.position = 'end';
    config.keyboard = false;

    let rule = () => {
      if (window.innerWidth < 1040) {
        this.btncanvas = true;
        this.nav1 = false;
        this.nav2 = false;
      } else {
        this.btncanvas = false;
        this.nav1 = true;
        this.nav2 = true;
        this.result?.close();
      }
    };

    window.onload = () => {
      rule();
    };

    window.addEventListener('resize', () => {
      rule();
    });

    router.events.subscribe(() => {
      rule();
    });
  }

  openEnd(content: TemplateRef<any>) {
    this.result = this.offcanvasService.open(content, { position: 'end' });
  }

  closeEnd() {
    this.result?.close()
  }

  navItem(navbar: NavBar[]) {
    this.navbar = navbar;
  }
}
