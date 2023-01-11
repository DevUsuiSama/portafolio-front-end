import { HttpParams } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbAlert, NgbModal, NgbModalConfig, NgbModalRef, NgbOffcanvas, NgbOffcanvasConfig, NgbOffcanvasRef } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, Subject } from 'rxjs';
import { User } from 'src/app/models/user';
import { FetchService } from 'src/app/service/fetch.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.sass'],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .dark-modal .modal-content
      background-color: #000000
      color: white
      border: 1px solid cyan
      border-style: groove
      box-shadow: 0 0 .4rem 0 cyan
      border-radius: 2px
    .dark-modal .close
      color: white
  `]
})
export class PanelComponent implements OnInit {
  private _success = new Subject<any>();
  user: User[] = [];
  form?: any;
  modal?: NgbModalRef;
  errorMessage: string = '';
  successMessage: string = '';
  nav1?: boolean;
  btncanvas?: boolean;
  result?: NgbOffcanvasRef;
  loading: boolean = false;

  @ViewChild('content', { static: false }) content?: TemplateRef<any>;
  @ViewChild('dangerAlert', { static: false }) dangerAlert?: NgbAlert;
  @ViewChild('successAlert', { static: false }) successAlert?: NgbAlert;

  private consultarTablaUsuario(): void {
    this.fetch.getServer('api/panel/user/get_all_usuarios').subscribe({
      next: (res: any) => {
        this.user = res;
      },
      error: () => {
        console.error('User: Request failed with error');
      },
      complete: () => {
        console.log('User: Request completed')
      }
    });
  }

  private operacionConCheckBoxSeleccionado(element: HTMLTableElement, lambda: Function) {
    for (let i = 1; i < element.rows.length; i++) {
      let checkBox: HTMLInputElement = element.rows[i].cells[0].querySelector<HTMLInputElement>("input[type='checkbox']") || new HTMLInputElement;
      if (checkBox.checked)
        lambda(checkBox);
    }
  }

  constructor(
    configCanvas: NgbOffcanvasConfig,
    private offcanvasService: NgbOffcanvas,
    private fetch: FetchService,
    private modalService: NgbModal,
    private router: Router,
    config: NgbModalConfig
  ) {
    config.backdrop = 'static';

    configCanvas.position = 'end';
    configCanvas.keyboard = false;

    let rule = () => {
      if (window.innerWidth < 1040) {
        this.btncanvas = true;
        this.nav1 = false;
      } else {
        this.btncanvas = false;
        this.nav1 = true;
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

  ngOnInit(): void {
    this._success.pipe(debounceTime(6000)).subscribe(() => {
      if (this.dangerAlert)
        this.dangerAlert.close();
      if (this.successAlert)
        this.successAlert.close();
    });

    this.consultarTablaUsuario();
  }

  openVerticallyCentered(content: any): NgbModalRef {
    return this.modalService.open(content, { centered: true, windowClass: 'dark-modal' });
  }

  editar(element: HTMLTableElement) {
    let alMenosUnCheckBoxSeleccionado: boolean = false;

    this.operacionConCheckBoxSeleccionado(element, (checkBox: HTMLInputElement) => {
      alMenosUnCheckBoxSeleccionado = checkBox.checked;
    });

    if (alMenosUnCheckBoxSeleccionado) {
      this.modal = this.openVerticallyCentered(this.content);

      let auxCheckBox: boolean = false;

      this.operacionConCheckBoxSeleccionado(element, (checkBox: HTMLInputElement) => {
        let perfil: string[] = checkBox.getAttribute('data-perfil')?.split(',') || [];
        perfil.forEach((e) => {
          if (e === 'ROLE_ADMIN')
            auxCheckBox = true;
        });
      });

      this.form = new FormBuilder().group({
        admin: new FormControl(auxCheckBox)
      });
    } else {
      this.errorMessage = 'Para realizar esta operación necesita seleccionar un usuario.';
      this._success.next('');
    }
  }

  eliminar(element: HTMLTableElement) {
    let alMenosUnCheckBoxSeleccionado: boolean = false;

    this.operacionConCheckBoxSeleccionado(element, (checkBox: HTMLInputElement) => {
      alMenosUnCheckBoxSeleccionado = checkBox.checked;
    });

    if (alMenosUnCheckBoxSeleccionado) {
      let id: number = 0;

      this.operacionConCheckBoxSeleccionado(element, (checkBox: HTMLInputElement) => {
        id = Number(checkBox.getAttribute('data-id'));
      });

      this.loading = true;
      document.body.style.overflowY = 'hidden';
      this.fetch.deleteServer(`api/panel/user/delete/${id}`).subscribe({
        next: (data) => {
          this.loading = false;
          document.body.style.overflowY = 'scroll';
          this.consultarTablaUsuario();
          this.successMessage = data.message;
          this._success.next('');
        },
        error: (error) => {
          this.loading = false;
          document.body.style.overflowY = 'scroll';
          console.error('User: Request failed with error');
          this.errorMessage = error.error.status + " " + error.error.error + " " + error.error.message;
          this._success.next('');
        },
        complete: () => {
          console.log('User: Request completed')
        }
      });

    } else {
      this.errorMessage = 'Para realizar esta operación necesita seleccionar un usuario.';
      this._success.next('');
    }
  }

  onSubmit(element: HTMLTableElement) {
    let auxCheckBox = false;
    let id: number = 0;
    let perfil: string[] = [];
    let auxPerfil = ''

    this.operacionConCheckBoxSeleccionado(element, (checkBox: HTMLInputElement) => {
      id = Number(checkBox.getAttribute('data-id'));
      perfil = checkBox.getAttribute('data-perfil')?.split(',') || [];
      perfil.forEach((e) => {
        if (e === 'ROLE_ADMIN')
          auxCheckBox = true;
      });
    });

    if (auxCheckBox)
      auxPerfil = 'ROLE_USER';
    else {
      perfil.push('ROLE_ADMIN');
      auxPerfil = perfil.join(',');
    }

    this.loading = true;
    document.body.style.overflowY = 'hidden';
    this.fetch.postServerParams('api/panel/user/save',
      new HttpParams()
        .append('id', id)
        .append('perfil', auxPerfil)
    ).subscribe({
      next: (data) => {
        this.loading = false;
        document.body.style.overflowY = 'scroll';
        this.consultarTablaUsuario();
        this.successMessage = data.message;
        this._success.next('');
        this.modal?.close('Close click');
      },
      error: (error) => {
        this.loading = false;
        document.body.style.overflowY = 'scroll';
        console.error('User: Request failed with error');
        this.errorMessage = error.error.status + " " + error.error.error + " " + error.error.message;
        this._success.next('');
      },
      complete: () => {
        console.log('User: Request completed')
      }
    });
  }

  soloUnCheckBoxSeleccionado(element: HTMLTableElement, checkBox: HTMLInputElement): void {
    for (let i = 1; i < element.rows.length; i++) {
      if (element.rows[i].getAttribute('data-id') !== checkBox.getAttribute('data-id')) {
        let auxCheckBox: HTMLInputElement = element.rows[i].cells[0].querySelector<HTMLInputElement>("input[type='checkbox']") || new HTMLInputElement;
        auxCheckBox.checked = false;
      }
    }
  }

  openEnd(content: TemplateRef<any>) {
    this.result = this.offcanvasService.open(content, { position: 'end' });
  }

  closeEnd() {
    this.result?.close()
  }
}
