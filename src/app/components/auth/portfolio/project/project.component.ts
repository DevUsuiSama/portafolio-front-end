import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, Subject } from 'rxjs';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { Project } from 'src/app/models/project';
import { FetchService } from 'src/app/service/fetch.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.sass']
})
export class ProjectComponent implements OnInit {
  private _success = new Subject<any>();
  project: Project[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  loading: boolean[] = [false, false];

  @ViewChild('modalProject', { static: false }) modalProject?: ModalComponent;
  @ViewChild('dangerAlert', { static: false }) dangerAlert?: NgbAlert;
  @ViewChild('successAlert', { static: false }) successAlert?: NgbAlert;

  private consultarTablaProyecto() {
    const ROUTE_PARAM = this.route.snapshot.paramMap;
    const USERNAME: string | any = ROUTE_PARAM.get('username');

    this.loading[1] = true;
    this.fetch.getServer(`api/portfolio/project/get_project/${USERNAME}`).subscribe({
      next: (res: any) => {
        this.loading[1] = false;
        this.project = res;
      },
      error: () => {
        this.loading[1] = false;
        console.error('Project: Request failed with error');
      },
      complete: () => {
        console.log('Project: Request completed')
      }
    });
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

    this.consultarTablaProyecto();
  }

  agregar(): void {
    const MODAL = this.modalProject?.openVerticallyCentered(this.modalProject?.content);

    this.modalProject?.setTitleModal('Proyecto');
    this.modalProject?.generateInput([{
      type: 'text',
      formControlName: 'titulo',
      placeholder: 'Título',
      span: 'Agregue un título'
    }, {
      type: 'textarea',
      formControlName: 'descripcion',
      placeholder: 'Descripción',
      span: 'Agregue un descripción',
      class: 'mt-2'
    }, {
      type: 'text',
      formControlName: 'imagen',
      placeholder: 'Imagen',
      span: 'Agregue un imagen',
      class: 'mt-2'
    }, {
      type: 'text',
      formControlName: 'repositorio',
      placeholder: 'Repositorio',
      span: 'Agregue un repositorio',
      class: 'mt-2'
    }], this.formBuilder.group({
      titulo: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
      descripcion: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]),
      imagen: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(300)]),
      repositorio: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(300)])
    }), (formulario: FormGroup) => {
      const ROUTE_PARAM = this.route.snapshot.paramMap;
      const USERNAME: string | any = ROUTE_PARAM.get('username');

      this.loading[0] = true;
      document.body.style.overflowY = 'hidden';

      this.fetch.postServer(`api/portfolio/project/save/${USERNAME}`, {
        titulo: formulario.get('titulo')?.value,
        descripcion: formulario.get('descripcion')?.value,
        imagen: formulario.get('imagen')?.value,
        repositorio: formulario.get('repositorio')?.value
      }).subscribe({
        next: (data) => {
          this.loading[0] = false;
          document.body.style.overflowY = 'scroll';
          this.successMessage = data.message;
          this.consultarTablaProyecto();
          this._success.next('');
          MODAL?.close('Close click');
        },
        error: (error) => {
          this.loading[0] = false;
          document.body.style.overflowY = 'scroll';
          console.error('Project: Request failed with error');
          this.errorMessage = error.error.status + " " + error.error.error + " " + error.error.message;
          this._success.next('');
        },
        complete: () => {
          console.log('Project: Request completed')
        }
      });
    });
  }

  editar(element: HTMLDivElement): void {
    const ID: number = Number(element.getAttribute('data-id'));
    let index: number = 0;

    this.project.forEach((e, i) => {
      if (e.id === ID)
        index = i;
    });

    const MODAL = this.modalProject?.openVerticallyCentered(this.modalProject?.content);

    this.modalProject?.setTitleModal('Proyecto');
    this.modalProject?.generateInput([{
      type: 'text',
      formControlName: 'titulo',
      placeholder: 'Título',
      span: 'Agregue un título'
    }, {
      type: 'textarea',
      formControlName: 'descripcion',
      placeholder: 'Descripción',
      span: 'Agregue un descripción',
      class: 'mt-2'
    }, {
      type: 'text',
      formControlName: 'imagen',
      placeholder: 'Imagen',
      span: 'Agregue un imagen',
      class: 'mt-2'
    }, {
      type: 'text',
      formControlName: 'repositorio',
      placeholder: 'Repositorio',
      span: 'Agregue un repositorio',
      class: 'mt-2'
    }], this.formBuilder.group({
      titulo: new FormControl(this.project[index].titulo, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
      descripcion: new FormControl(this.project[index].descripcion, [Validators.required, Validators.minLength(5), Validators.maxLength(200)]),
      imagen: new FormControl(this.project[index].imagen, [Validators.required, Validators.minLength(5), Validators.maxLength(300)]),
      repositorio: new FormControl(this.project[index].repositorio, [Validators.required, Validators.minLength(5), Validators.maxLength(300)])
    }), (formulario: FormGroup) => {
      this.loading[0] = true;
      document.body.style.overflowY = 'hidden';

      this.fetch.putServer(`api/portfolio/project/update/${ID}`, {
        titulo: formulario.get('titulo')?.value,
        descripcion: formulario.get('descripcion')?.value,
        imagen: formulario.get('imagen')?.value,
        repositorio: formulario.get('repositorio')?.value
      }).subscribe({
        next: (data) => {
          this.loading[0] = false;
          document.body.style.overflowY = 'scroll';
          this.successMessage = data.message;
          this.consultarTablaProyecto();
          this._success.next('');
          MODAL?.close('Close click');
        },
        error: (error) => {
          this.loading[0] = false;
          document.body.style.overflowY = 'scroll';
          console.error('Project: Request failed with error');
          this.errorMessage = error.error.status + " " + error.error.error + " " + error.error.message;
          this._success.next('');
        },
        complete: () => {
          console.log('Project: Request completed')
        }
      });
    });
  }

  eliminar(element: HTMLDivElement): void {
    const ID: number = Number(element.getAttribute('data-id'));

    this.loading[0] = true;
    document.body.style.overflowY = 'hidden';
    this.fetch.deleteServer(`api/portfolio/project/delete/${ID}`).subscribe({
      next: (data) => {
        this.loading[0] = false;
        document.body.style.overflowY = 'scroll';
        this.successMessage = data.message;
        this.consultarTablaProyecto();
        this._success.next('');
      },
      error: (error) => {
        this.loading[0] = false;
        document.body.style.overflowY = 'scroll';
        console.error('Project: Request failed with error');
        this.errorMessage = error.error.status + " " + error.error.error + " " + error.error.message;
        this._success.next('');
      },
      complete: () => {
        console.log('Project: Request completed')
      }
    });
  }
}
