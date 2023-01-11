import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, Subject } from 'rxjs';

import { AuthenticationService } from 'src/app/service/authentication.service';
import { ModalComponent } from '../../modal/modal.component';

@Component({
  selector: 'app-formlogin',
  templateUrl: './formlogin.component.html',
  styleUrls: ['./formlogin.component.sass'],
  styles: [`
		:host .alert-custom
			color: yellow
			background-color: black
			border-color: yellow
  `]
})
export class FormLoginComponent implements OnInit {
  private _success = new Subject<string>();
  formLogin: any;
  errorMessage: string = '';
  loading: boolean = false;

  @ViewChild(ModalComponent) modal?: ModalComponent;
  @ViewChild('dangerAlert', { static: false }) dangerAlert?: NgbAlert;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authentication: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.formLogin = this.formBuilder.group({
      user: new FormControl('', [Validators.required, Validators.minLength(5)]),
      pass: new FormControl('', [Validators.required, Validators.minLength(5)])
    });

    this._success.pipe(debounceTime(6000)).subscribe(() => {
      if (this.dangerAlert)
        this.dangerAlert.close();
    });
  }

  onSubmit(formLogin: any) {
    this.loading = true;
    document.body.style.overflowY = 'hidden';
    this.authentication.login({
      username: formLogin.get('user').value,
      password: formLogin.get('pass').value
    }).subscribe({
      next: (res) => {
        this.loading = false;
        document.body.style.overflowY = 'scroll';
        let adminDetectado = false;
        res.roles.forEach((element: string): void => {
          if (element === 'ROLE_ADMIN') {
            this.modal?.generateButton('Opción', [{
                title: 'Administrador',
                routerLink: ['/panel']
              }, {
                title: 'Usuario',
                routerLink: ['/portfolio', JSON.parse(sessionStorage['currentUser']).username]
              }]);
              this.modal?.openVerticallyCentered(this.modal.content);
              adminDetectado = !adminDetectado;
          }
        });
          
        if (res.roles[0] === 'ROLE_USER' && !adminDetectado)
          this.router.navigate(['']);
      },
      error: (error: any) => {
        this.loading = false;
        document.body.style.overflowY = 'scroll';
        console.error('Request failed with error');
        this.errorMessage = error.error.status + " " + error.error.error + " " + error.error.message;
        this._success.next('');
      },
      complete: () => {
        console.log('Request completed')
      }
    });
  }

  get userBox(): AbstractControl {
    return this.formLogin.get('user')!;
  }

  get passBox(): AbstractControl {
    return this.formLogin.get('pass')!;
  }
}