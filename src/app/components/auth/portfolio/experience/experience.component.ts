import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, Subject } from 'rxjs';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { Experience } from 'src/app/models/experience';
import { FetchService } from 'src/app/service/fetch.service';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.sass']
})
export class ExperienceComponent implements OnInit {
  private _success = new Subject<any>();
  experience: Experience[] = [];
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
    placeholder: 'Agregar un titulo',
    span: 'Agregar un titulo',
    class: 'mt-2'
  }, {
    type: 'textarea',
    formControlName: 'descripcion',
    placeholder: 'Agregar una descripción',
    span: 'Agregar una descripción',
    class: 'mt-2'
  }, {
    type: 'checkbox',
    formControlName: 'final',
    placeholder: 'Actualmente tengo este cargo',
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

  @ViewChild('modalExperience', { static: false }) modalExperience?: ModalComponent;
  @ViewChild('dangerAlert', { static: false }) dangerAlert?: NgbAlert;
  @ViewChild('successAlert', { static: false }) successAlert?: NgbAlert;

  private consultarTablaExperiencia(): void {
    const ROUTE_PARAM = this.route.snapshot.paramMap;
    const USERNAME: string | any = ROUTE_PARAM.get('username');

    this.loading[1] = true;
    this.fetch.getServer(`api/portfolio/experience/get_experience/${USERNAME}`).subscribe({
      next: (res: any) => {
        this.loading[1] = false;
        this.experience = res;
      },
      error: () => {
        this.loading[1] = false;
        console.error('Experience: Request failed with error');
      },
      complete: () => {
        console.log('Experience: Request completed')
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

    this.consultarTablaExperiencia();
  }

  agregar() {
    const MODAL = this.modalExperience?.openVerticallyCentered(this.modalExperience?.content);

    this.modalExperience?.setTitleModal('Acerca De Mí');
    this.modalExperience?.generateInput(this.input, this.formBuilder.group({
      url: new FormControl('', [Validators.required, Validators.minLength(50), Validators.maxLength(300)]),
      titulo: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(100)]),
      descripcion: new FormControl('', [Validators.required, Validators.minLength(50), Validators.maxLength(300)]),
      final: new FormControl(false, []),
      fechaInicio: new FormControl('', [Validators.required]),
      fechaFinal: new FormControl('', [Validators.required])
    }), (form: any) => {
      const ROUTER_PARAM = this.route.snapshot.paramMap;
      const USERNAME: string | any = ROUTER_PARAM.get('username');
      const CHECKBOX = form.get('final').value;
      const FECHA_INICIO = form.get('fechaInicio').value;
      const FECHA_FINAL = form.get('fechaFinal').value;
      const AUX_EXPERIENCE = new Experience;

      AUX_EXPERIENCE.url = form.get('url').value;
      AUX_EXPERIENCE.titulo = form.get('titulo').value;
      AUX_EXPERIENCE.descripcion = form.get('descripcion').value;
      AUX_EXPERIENCE.fechaInicio = FECHA_INICIO.year + "-" + FECHA_INICIO.month + "-" + FECHA_INICIO.day;

      if (CHECKBOX)
        AUX_EXPERIENCE.fechaFinal = '';
      else {
        AUX_EXPERIENCE.fechaFinal = FECHA_FINAL.year + "-" + FECHA_FINAL.month + "-" + FECHA_FINAL.day;
        this.fechaInicialMayorOIgualAFechaFinal(FECHA_INICIO, FECHA_FINAL);
      }

      if (this.errorMessage === '') {
        this.loading[0] = true;
        document.body.style.overflowY = 'hidden';
        this.fetch.postServer(`api/portfolio/experience/save/${USERNAME}`, {
          url: AUX_EXPERIENCE.url,
          titulo: AUX_EXPERIENCE.titulo,
          descripcion: AUX_EXPERIENCE.descripcion,
          fechaInicio: AUX_EXPERIENCE.fechaInicio,
          fechaFinal: AUX_EXPERIENCE.fechaFinal
        }).subscribe({
          next: (data) => {
            this.loading[0] = false;
            document.body.style.overflowY = 'scroll';
            this.successMessage = data.message;
            this.consultarTablaExperiencia();
            this._success.next('');
            MODAL?.close('Close click');
          },
          error: (error) => {
            this.loading[0] = false;
            document.body.style.overflowY = 'scroll';
            console.error('Experience: Request failed with error');
            this.errorMessage = error.error.status + " " + error.error.error + " " + error.error.message;
            this._success.next('');
          },
          complete: () => {
            console.log('Experience: Request completed')
          }
        });
      }
    });
  }

  editar(element: HTMLDivElement): void {
    const ID: number = Number(element.getAttribute('data-id'));
    let index: number = 0;

    this.experience.forEach((e, i) => {
      if (e.id === ID)
        index = i;
    });

    const fechaFinalEstado: boolean = (this.experience[index].fechaFinal === null);

    let fechaInicioFormat: any = this.experience[index].fechaInicio?.split('-');
    let fechaFinalFormat: any = this.experience[index].fechaFinal?.split('-');

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

    this.modalExperience?.setDisabled(fechaFinalEstado);
    const MODAL = this.modalExperience?.openVerticallyCentered(this.modalExperience?.content);

    this.modalExperience?.setTitleModal('Acerca De Mí');
    this.modalExperience?.generateInput(this.input, this.formBuilder.group({
      url: new FormControl(this.experience[index].url, [Validators.required, Validators.minLength(50), Validators.maxLength(300)]),
      titulo: new FormControl(this.experience[index].titulo, [Validators.required, Validators.minLength(4), Validators.maxLength(100)]),
      descripcion: new FormControl(this.experience[index].descripcion, [Validators.required, Validators.minLength(50), Validators.maxLength(300)]),
      final: new FormControl(fechaFinalEstado, []),
      fechaInicio: new FormControl(fechaInicioFormat, [Validators.required]),
      fechaFinal: new FormControl({ value: fechaFinalFormat, disabled: fechaFinalEstado }, [Validators.required])
    }), (form: any) => {
      const CHECKBOX = form.get('final').value;
      const FECHA_INICIO = form.get('fechaInicio').value;
      const FECHA_FINAL = form.get('fechaFinal').value;
      const AUX_EXPERIENCE = new Experience;

      AUX_EXPERIENCE.url = form.get('url').value;
      AUX_EXPERIENCE.titulo = form.get('titulo').value;
      AUX_EXPERIENCE.descripcion = form.get('descripcion').value;
      AUX_EXPERIENCE.fechaInicio = FECHA_INICIO.year + "-" + FECHA_INICIO.month + "-" + FECHA_INICIO.day;

      if (CHECKBOX)
        AUX_EXPERIENCE.fechaFinal = '';
      else {
        AUX_EXPERIENCE.fechaFinal = FECHA_FINAL.year + "-" + FECHA_FINAL.month + "-" + FECHA_FINAL.day;
        this.fechaInicialMayorOIgualAFechaFinal(FECHA_INICIO, FECHA_FINAL);
      }

      if (this.errorMessage === '') {
        this.loading[0] = true;
        document.body.style.overflowY = 'hidden';

        this.fetch.putServer(`api/portfolio/experience/update/${ID}`, {
          url: AUX_EXPERIENCE.url,
          titulo: AUX_EXPERIENCE.titulo,
          descripcion: AUX_EXPERIENCE.descripcion,
          fechaInicio: AUX_EXPERIENCE.fechaInicio,
          fechaFinal: AUX_EXPERIENCE.fechaFinal
        }).subscribe({
          next: (data) => {
            this.loading[0] = false;
            document.body.style.overflowY = 'scroll';
            this.successMessage = data.message;
            this.consultarTablaExperiencia();
            this._success.next('');
            MODAL?.close('Close click');
          },
          error: (error) => {
            this.loading[0] = false;
            document.body.style.overflowY = 'scroll';
            console.error('Experience: Request failed with error');
            this.errorMessage = error.error.status + " " + error.error.error + " " + error.error.message;
            this._success.next('');
          },
          complete: () => {
            console.log('Experience: Request completed')
          }
        });
      }
    });
  }

  eliminar(element: HTMLDivElement): void {
    const ID: number = Number(element.getAttribute('data-id'));
    this.loading[0] = true;
    document.body.style.overflowY = 'hidden';
    this.fetch.deleteServer(`api/portfolio/experience/delete/${ID}`).subscribe({
      next: (data) => {
        this.loading[0] = false;
        document.body.style.overflowY = 'scroll';
        this.successMessage = data.message;
        this.consultarTablaExperiencia();
        this._success.next('');
      },
      error: (error) => {
        this.loading[0] = false;
        document.body.style.overflowY = 'scroll';
        console.error('Experience: Request failed with error');
        this.errorMessage = error.error.status + " " + error.error.error + " " + error.error.message;
        this._success.next('');
      },
      complete: () => {
        console.log('Experience: Request completed')
      }
    });
  }
}
