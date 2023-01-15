import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, Subject } from 'rxjs';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { Education } from 'src/app/models/education';
import { FetchService } from 'src/app/service/fetch.service';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.sass']
})
export class EducationComponent implements OnInit {
  private _success = new Subject<any>();
  education: Education[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  input = [{
    type: 'text',
    formControlName: 'url',
    placeholder: 'Agregar un link de una Imagén',
    span: 'Agregar un link de una Imagén'
  }, {
    type: 'text',
    formControlName: 'titulo',
    placeholder: 'Agregar un título',
    span: 'Agregar un título',
    class: 'mt-2'
  }, {
    type: 'text',
    formControlName: 'tituloDeLaCarrera',
    placeholder: 'Agregar el título de la carrera',
    span: 'Agregar el título de la carrera',
    class: 'mt-2'
  }, {
    type: 'textarea',
    formControlName: 'descripcion',
    placeholder: 'Agregar una descripción',
    span: 'Agregar una descripción',
    class: 'mt-2'
  }, {
    type: 'select',
    formControlName: 'estado',
    placeholder: 'Seleccionar un estado',
    span: 'Seleccionar un estado',
    class: 'mt-2',
    options: [
      'Promoción',
      'No Completado',
      'Empezando'
    ]
  }, {
    type: 'checkbox',
    formControlName: 'final',
    placeholder: 'Actualmente estoy cursando',
    class: 'mt-2'
  }, {
    type: 'date',
    formControlName: 'fechaInicio',
    placeholder: 'Agregar una fecha de inicio laboral',
    span: 'Agregar una fecha de inicio laboral',
    class: 'mt-2'
  }, {
    type: 'date',
    formControlName: 'fechaFinal',
    placeholder: 'Agregar una fecha de finalización laboral',
    span: 'Agregar una fecha de finalización laboral',
    class: 'mt-2',
    disabled: true
  }];
  loading: boolean[] = [false, false];

  @ViewChild('modalEducation', { static: false }) modalEducation?: ModalComponent;
  @ViewChild('dangerAlert', { static: false }) dangerAlert?: NgbAlert;
  @ViewChild('successAlert', { static: false }) successAlert?: NgbAlert;

  private consultarTablaEducacion(): void {
    const ROUTE_PARAM = this.route.snapshot.paramMap;
    const USERNAME: string | any = ROUTE_PARAM.get('username');

    this.loading[1] = true;
    this.fetch.getServer(`api/portfolio/education/get_education/${USERNAME}`).subscribe({
      next: (res: any) => {
        this.loading[1] = false;
        this.education = res;
      },
      error: () => {
        this.loading[1] = false;
        console.error('Education: Request failed with error');
      },
      complete: () => {
        console.log('Education: Request completed')
      }
    });
  }

  private fechaInicialMayorOIgualAFechaFinal(fechaInicio: any, fechaFinal: any): void {
    const fechaInicioDate = new Date(fechaInicio.year, fechaInicio.month, fechaInicio.day);
    const fechaFinalDate = new Date(fechaFinal.year, fechaFinal.month, fechaFinal.day);

    if (fechaInicioDate.getTime() >= fechaFinalDate.getTime()) {
      this.errorMessage = 'La fecha final debe ser mayor a la fecha incial.';
      this._success.next('');
    }
  }

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

    this.consultarTablaEducacion();
  }

  agregar() {
    const MODAL = this.modalEducation?.openVerticallyCentered(this.modalEducation?.content);
    
    this.modalEducation?.setTitleModal('Educación');
    this.modalEducation?.generateInput(this.input, this.formBuilder.group({
      url: new FormControl('', [Validators.required, Validators.minLength(50), Validators.maxLength(300)]),
      titulo: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]),
      tituloDeLaCarrera: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]),
      descripcion: new FormControl('', [Validators.required, Validators.minLength(50), Validators.maxLength(300)]),
      estado: new FormControl('', [Validators.required]),
      final: new FormControl(false, []),
      fechaInicio: new FormControl('', [Validators.required]),
      fechaFinal: new FormControl('', [Validators.required])
    }), (form: any) => {
      const ROUTE_PARAM = this.route.snapshot.paramMap;
      const USERNAME: string | any = ROUTE_PARAM.get('username');
      const CHECKBOX = form.get('final').value;
      const FECHA_INICIO = form.get('fechaInicio').value;
      const FEHCA_FINAL = form.get('fechaFinal').value;
      const AUX_EDUCATION = new Education;

      AUX_EDUCATION.url = form.get('url').value;
      AUX_EDUCATION.titulo = form.get('titulo').value;
      AUX_EDUCATION.tituloDeLaCarrera = form.get('tituloDeLaCarrera').value;
      AUX_EDUCATION.descripcion = form.get('descripcion').value;
      switch (form.get('estado').value) {
        case 'Promoción':
          AUX_EDUCATION.estado = 1;
          break;
        case 'No Completado':
          AUX_EDUCATION.estado = 2;
          break;
        case 'Empezando':
          AUX_EDUCATION.estado = 3;
          break;
      }
      AUX_EDUCATION.fechaInicio = FECHA_INICIO.year + "-" + FECHA_INICIO.month + "-" + FECHA_INICIO.day;

      if (CHECKBOX)
        AUX_EDUCATION.fechaFinal = '';
      else {
        AUX_EDUCATION.fechaFinal = FEHCA_FINAL.year + "-" + FEHCA_FINAL.month + "-" + FEHCA_FINAL.day;
        this.fechaInicialMayorOIgualAFechaFinal(FECHA_INICIO, FEHCA_FINAL);
      }

      if (this.errorMessage === '') {
        this.loading[0] = true;
        document.body.style.overflowY = 'hidden';

        this.fetch.postServer(`api/portfolio/education/save/${USERNAME}`, {
          url: AUX_EDUCATION.url,
          titulo: AUX_EDUCATION.titulo,
          tituloDeLaCarrera: AUX_EDUCATION.tituloDeLaCarrera,
          descripcion: AUX_EDUCATION.descripcion,
          estado: AUX_EDUCATION.estado,
          fechaInicio: AUX_EDUCATION.fechaInicio,
          fechaFinal: AUX_EDUCATION.fechaFinal
        }).subscribe({
          next: (data) => {
            this.loading[0] = false;
            document.body.style.overflowY = 'scroll';
            this.successMessage = data.message;
            this.consultarTablaEducacion();
            this._success.next('');
            MODAL?.close('Close click');
          },
          error: (error) => {
            this.loading[0] = false;
            document.body.style.overflowY = 'scroll';
            console.error('Education: Request failed with error');
            this.errorMessage = error.error.status + " " + error.error.error + " " + error.error.message;
            this._success.next('');
          },
          complete: () => {
            console.log('Education: Request completed')
          }
        });
      }
    });
  }

  editar(element: HTMLDivElement) {
    const ID: number = Number(element.getAttribute('data-id'));
    let index: number = 0;

    this.education.forEach((e, i) => {
      if (e.id === ID)
        index = i;
    });

    const FECHA_FINAL_ESTADO: boolean = (this.education[index].fechaFinal === null);

    let fechaInicioFormat: any = this.education[index].fechaInicio?.split('-');
    let fechaFinalFormat: any = this.education[index].fechaFinal?.split('-');

    fechaInicioFormat = {
      year: Number(fechaInicioFormat[0]),
      month: Number(fechaInicioFormat[1]),
      day: Number(fechaInicioFormat[2])
    };

    if (fechaFinalFormat !== undefined)
      fechaFinalFormat = {
        year: Number(fechaFinalFormat[0]),
        month: Number(fechaFinalFormat[1]),
        day: Number(fechaFinalFormat[2])
      }

    this.modalEducation?.setDisabled(FECHA_FINAL_ESTADO);
    const modal = this.modalEducation?.openVerticallyCentered(this.modalEducation?.content);

    this.modalEducation?.setTitleModal('Educación');
    this.modalEducation?.generateInput(this.input, this.formBuilder.group({
      url: new FormControl(this.education[index].url, [Validators.required, Validators.minLength(50), Validators.maxLength(300)]),
      titulo: new FormControl(this.education[index].titulo, [Validators.required, Validators.minLength(4), Validators.maxLength(100)]),
      tituloDeLaCarrera: new FormControl(this.education[index].tituloDeLaCarrera, [Validators.required, Validators.minLength(10), Validators.maxLength(100)]),
      descripcion: new FormControl(this.education[index].descripcion, [Validators.required, Validators.minLength(50), Validators.maxLength(300)]),
      estado: new FormControl((this.education[index].estado === 1) ? 'Promoción' : ((this.education[index].estado === 2) ? 'No Completado' : 'Empezando'), [Validators.required]),
      final: new FormControl(FECHA_FINAL_ESTADO, []),
      fechaInicio: new FormControl(fechaInicioFormat, [Validators.required]),
      fechaFinal: new FormControl({ value: fechaFinalFormat, disabled: FECHA_FINAL_ESTADO }, [Validators.required])
    }), (form: any) => {
      const checkbox = form.get('final').value;
      const fechaInicio = form.get('fechaInicio').value;
      const fechaFinal = form.get('fechaFinal').value;
      const AUX_EDUCATION = new Education;

      AUX_EDUCATION.url = form.get('url').value;
      AUX_EDUCATION.titulo = form.get('titulo').value;
      AUX_EDUCATION.tituloDeLaCarrera = form.get('tituloDeLaCarrera').value;
      AUX_EDUCATION.descripcion = form.get('descripcion').value;
      switch (form.get('estado').value) {
        case 'Promoción':
          AUX_EDUCATION.estado = 1;
          break;
        case 'No Completado':
          AUX_EDUCATION.estado = 2;
          break;
        case 'Empezando':
          AUX_EDUCATION.estado = 3;
          break;
      }
      AUX_EDUCATION.fechaInicio = fechaInicio.year + "-" + fechaInicio.month + "-" + fechaInicio.day;

      if (checkbox)
        AUX_EDUCATION.fechaFinal = '';
      else {
        AUX_EDUCATION.fechaFinal = fechaFinal.year + "-" + fechaFinal.month + "-" + fechaFinal.day;
        this.fechaInicialMayorOIgualAFechaFinal(fechaInicio, fechaFinal);
      }

      if (this.errorMessage === '') {
        this.loading[0] = true;
        document.body.style.overflowY = 'hidden';

        this.fetch.putServer(`api/portfolio/education/update/${ID}`, {
          url: AUX_EDUCATION.url,
          titulo: AUX_EDUCATION.titulo,
          tituloDeLaCarrera: AUX_EDUCATION.tituloDeLaCarrera,
          descripcion: AUX_EDUCATION.descripcion,
          estado: AUX_EDUCATION.estado,
          fechaInicio: AUX_EDUCATION.fechaInicio,
          fechaFinal: AUX_EDUCATION.fechaFinal
        }).subscribe({
          next: (data) => {
            this.loading[0] = false;
            document.body.style.overflowY = 'scroll';
            this.successMessage = data.message;
            this.consultarTablaEducacion();
            this._success.next('');
            modal?.close('Close click');
          },
          error: (error) => {
            this.loading[0] = false;
            document.body.style.overflowY = 'scroll';
            console.error('Education: Request failed with error');
            this.errorMessage = error.error.status + " " + error.error.error + " " + error.error.message;
            this._success.next('');
          },
          complete: () => {
            console.log('Education: Request completed')
          }
        });
      }
    });
  }

  eliminar(element: HTMLDivElement) {
    const ID: number = Number(element.getAttribute('data-id'));
    this.loading[0] = true;
    document.body.style.overflowY = 'hidden';
    this.fetch.deleteServer(`api/portfolio/education/delete/${ID}`).subscribe({
      next: (data) => {
        this.loading[0] = false;
        document.body.style.overflowY = 'scroll';
        this.successMessage = data.message;
        this.consultarTablaEducacion();
        this._success.next('');
      },
      error: (error) => {
        this.loading[0] = false;
        document.body.style.overflowY = 'scroll';
        console.error('Education: Request failed with error');
        this.errorMessage = error.error.status + " " + error.error.error + " " + error.error.message;
        this._success.next('');
      },
      complete: () => {
        console.log('Education: Request completed')
      }
    });
  }
}
