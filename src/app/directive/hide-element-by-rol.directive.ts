import { AfterViewInit, Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appHideElementByRol]'
})
export class HideElementByRolDirective implements AfterViewInit {

  constructor(
    private _elementRef: ElementRef<HTMLElement>
  ) { }

  ngAfterViewInit(): void {
    let encontrarRolAdministrador = false;
    const CURRENT_USER = JSON.parse(sessionStorage['currentUser'] || '{}');
    
    if (CURRENT_USER && CURRENT_USER.roles) {
      let rol: string[] = CURRENT_USER.roles;
      rol.forEach((e) => {
        if (e === 'ROLE_ADMIN')
          encontrarRolAdministrador = true;
      });

      if (!encontrarRolAdministrador)
        this._elementRef.nativeElement.remove();
    }
  }
}
