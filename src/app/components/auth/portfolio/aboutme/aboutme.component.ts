import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, Subject } from 'rxjs';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { AboutMe } from 'src/app/models/aboutme';
import { FetchService } from 'src/app/service/fetch.service';

@Component({
  selector: 'app-aboutme',
  templateUrl: './aboutme.component.html',
  styleUrls: ['./aboutme.component.sass']
})
export class AboutmeComponent implements OnInit {
  private _success = new Subject<any>();
  aboutMe: AboutMe = new AboutMe;
  errorMessage: string = '';
  successMessage: string = '';
  loading: boolean = false;

  @ViewChild('editAboutMe', { static: false }) editAboutMe?: ModalComponent;
  @ViewChild('dangerAlert', { static: false }) dangerAlert?: NgbAlert;
  @ViewChild('successAlert', { static: false }) successAlert?: NgbAlert;

  constructor(
    private formBuilder: FormBuilder,
    private fetch: FetchService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._success.pipe(debounceTime(6000)).subscribe(() => {
      if (this.dangerAlert)
        this.dangerAlert.close();
      if (this.successAlert)
        this.successAlert.close();
    });

    const ROUTE_PARAM = this.route.snapshot.paramMap;
    const USERNAME: string | any = ROUTE_PARAM.get('username');

    this.fetch.getServer(`api/portfolio/about_me/get_description/${USERNAME}`).subscribe({
      next: (res: any) => {
        if (res.text !== null)
          this.aboutMe.descripcion = res.text;
      },
      error: () => {
        console.error('AboutMe: Request failed with error');
      },
      complete: () => {
        console.log('AboutMe: Request completed')
      }
    });
  }

  editarAcercaDe() {
    const MODAL = this.editAboutMe?.openVerticallyCentered(this.editAboutMe?.content);
    
    this.editAboutMe?.setTitleModal('Acerca De Mí');
    this.editAboutMe?.generateInput([{
      type: 'textarea',
      formControlName: 'descripcion',
      placeholder: 'Descripción de tu Persona',
      span: 'Agregar una Descripción de Tu Persona'
    }], this.formBuilder.group({
      descripcion: new FormControl(this.aboutMe.descripcion, [Validators.required, Validators.minLength(100), Validators.maxLength(500)])
    }), (form: any) => {
      const ROUTE_PARAM = this.route.snapshot.paramMap;
      const USERNAME: string | any = ROUTE_PARAM.get('username');
      
      this.loading = true;
      document.body.style.overflowY = 'hidden';

      this.fetch.postServerParams('api/portfolio/about_me/save',
        new HttpParams()
          .append('username', USERNAME)
          .append('description', form.get('descripcion').value)
      ).subscribe({
        next: (data) => {
          this.loading = false;
          document.body.style.overflowY = 'scroll';
          this.successMessage = data.message;
          this.aboutMe.descripcion = form.get('descripcion').value;
          this._success.next('');
          MODAL?.close('Close click');
        },
        error: (error) => {
          this.loading = false;
          document.body.style.overflowY = 'scroll';
          console.error('AboutMe: Request failed with error');
          this.errorMessage = error.error.status + " " + error.error.error + " " + error.error.message;
          this._success.next('');
        },
        complete: () => {
          console.log('AboutMe: Request completed')
        }
      });
    });
  }
}
