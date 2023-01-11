import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, Subject } from 'rxjs';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { FetchService } from 'src/app/service/fetch.service';
import { ModalComponent } from '../../modal/modal.component';

@Component({
  selector: 'app-formsignup',
  templateUrl: './formsignup.component.html',
  styleUrls: ['./formsignup.component.sass']
})
export class FormSignupComponent implements OnInit {
  private _success = new Subject<string>();

  private clavesIguales(formSignup: any): boolean {
    return (formSignup.get('pass').value === formSignup.get('pass2').value);
  }

  formSignup: any;
  errorMessage: string = '';
  loading: boolean = false;

  @ViewChild('dangerAlert', { static: false }) dangerAlert?: NgbAlert;
  @ViewChild(ModalComponent) modal?: ModalComponent;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private fetch: FetchService,
    private authentication: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.formSignup = this.formBuilder.group({
      user: new FormControl('', [Validators.required, Validators.minLength(5)]),
      email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.com$")]),
      pass: new FormControl('', [Validators.required, Validators.minLength(5)]),
      pass2: new FormControl('', [Validators.required, Validators.minLength(5)])
    });

    this._success.pipe(debounceTime(6000)).subscribe(() => {
      if (this.dangerAlert)
        this.dangerAlert.close();
    });
  }

  onSubmit(formSignup: any) {
    if (this.clavesIguales(formSignup)) {
      this.loading = true;
      document.body.style.overflowY = 'hidden';
      this.fetch.postServer('api/auth/signup', {
        username: formSignup.get('user').value,
        email: formSignup.get('email').value,
        password: formSignup.get('pass').value
      }).subscribe({
        next: () => {
          this.authentication.login({
            username: formSignup.get('user').value,
            password: formSignup.get('pass').value
          }).subscribe({
            next: (res) => {
              this.loading = false;
              document.body.style.overflowY = 'scroll';
              let adminDetectado = false;
              res.roles.forEach((element: string) => {
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
                  return;
                }
              });

              if (res.roles[0] === 'ROLE_USER' && !adminDetectado)
                this.router.navigate(['']);
            },
            error: (error) => {
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
        },
        error: (error: any) => {
          this.loading = false;
          document.body.style.overflowY = 'scroll';
          console.error('Request failed with error');
          this.errorMessage = error.status + " " + error.name + " " + error.error.message;
          this._success.next('');
        },
        complete: () => {
          console.log('Request completed');
        }
      });
    } else {
      this.errorMessage = 'Las claves deben ser iguales';
      this._success.next('');
    }
  }

  get userBox(): AbstractControl {
    return this.formSignup.get('user');
  }

  get emailBox(): AbstractControl {
    return this.formSignup.get('email');
  }

  get passBox(): AbstractControl {
    return this.formSignup.get('pass');
  }

  get passTwoBox(): AbstractControl {
    return this.formSignup.get('pass2');
  }
}
