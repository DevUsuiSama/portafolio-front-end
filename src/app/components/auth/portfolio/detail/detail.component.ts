import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, Subject } from 'rxjs';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { Detail } from 'src/app/models/detail';
import { FetchService } from 'src/app/service/fetch.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.sass']
})
export class DetailComponent implements OnInit {
  private _success = new Subject<any>();
  detail: Detail = new Detail();;
  errorMessage: string = '';
  successMessage: string = '';
  loading: boolean[] = [false, false];

  @ViewChild('editDetail', { static: false }) editDetail?: ModalComponent;
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

    this.loading[1] = true;
    this.fetch.getServer(`api/portfolio/detail/get_detail/${USERNAME}`).subscribe({
      next: (res: any) => {
        this.loading[1] = false;
        if (res.nombre !== null) {
          this.detail.nombre = res.nombre;
          this.detail.apellido = res.apellido;
          this.detail.titulo = res.titulo;
          this.detail.ubicacion = res.ubicacion;
        }
      },
      error: () => {
        this.loading[1] = false;
        console.error('Detail: Request failed with error');
      },
      complete: () => {
        console.log('Detail: Request completed')
      }
    });
  }

  editarDetail() {
    const MODAL = this.editDetail?.openVerticallyCentered(this.editDetail?.content);
    
    this.editDetail?.setTitleModal('Detalle');
    this.editDetail?.generateInput([{
      type: 'text',
      formControlName: 'nombre',
      placeholder: 'Agregue un Nombre',
      span: 'Agregue un Nombre'
    }, {
      type: 'text',
      formControlName: 'apellido',
      placeholder: 'Agregue un Apellido',
      span: 'Agregue un Apellido',
      class: 'mt-2'
    }, {
      type: 'text',
      formControlName: 'titulo',
      placeholder: 'Agregue un Titulo',
      span: 'Agregue un Titulo',
      class: 'mt-2'
    }, {
      type: 'select',
      formControlName: 'ubicacion',
      placeholder: 'Agregue una Ubicación',
      span: 'Agregue una Ubicación',
      class: 'mt-2',
      options: [
        'Misiones, Argentina',
        'Buenos Aires, Argentina',
        'Tierra del Fuergo, Argentina'
      ]
    }], this.formBuilder.group({
      nombre: new FormControl(this.detail.nombre, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]),
      apellido: new FormControl(this.detail.apellido, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]),
      titulo: new FormControl(this.detail.titulo, [Validators.required, Validators.minLength(20), Validators.maxLength(200)]),
      ubicacion: new FormControl(this.detail.ubicacion, [Validators.required])
    }), (form: any) => {
      const ROUTE_PARAM = this.route.snapshot.paramMap;
      const USERNAME: string | any = ROUTE_PARAM.get('username');
      console.log(form);

      this.loading[0] = true;
      document.body.style.overflowY = 'hidden';

      this.fetch.postServer('api/portfolio/detail/save', {
        username: USERNAME,
        nombre: form.get('nombre').value,
        apellido: form.get('apellido').value,
        titulo: form.get('titulo').value,
        ubicacion: form.get('ubicacion').value
      }).subscribe({
        next: (data) => {
          this.loading[0] = false;
          document.body.style.overflowY = 'scroll';
          this.successMessage = data.message;
          this.detail.nombre = form.get('nombre').value;
          this.detail.apellido = form.get('apellido').value;
          this.detail.titulo = form.get('titulo').value;
          this.detail.ubicacion = form.get('ubicacion').value;
          this._success.next('');
          MODAL?.close('Close click');
        },
        error: (error) => {
          this.loading[0] = false;
          document.body.style.overflowY = 'scroll';
          console.error('Detail: Request failed with error');
          this.errorMessage = error.error.status + " " + error.error.error + " " + error.error.message;
          this._success.next('');
        },
        complete: () => {
          console.log('Detail: Request completed')
        }
      });
    });
  }
}
