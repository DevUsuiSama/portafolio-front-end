import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, Subject } from 'rxjs';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { InputCheckBox, InputSelectCheckBox } from 'src/app/models/elements';
import { HardSkills } from 'src/app/models/hardskills';
import { LevelSkills } from 'src/app/models/leveskills';
import { SoftSkills } from 'src/app/models/softskill';
import { FetchService } from 'src/app/service/fetch.service';
import { LIST_HARD_SKILLS } from './listhardskills';

@Component({
  selector: 'app-hard-and-soft-skills',
  templateUrl: './hard-and-soft-skills.component.html',
  styleUrls: ['./hard-and-soft-skills.component.sass'],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    $color: #323233
    .my-custom-tooltip .tooltip-inner
      background-color: $color
      font-size: 125%
      box-shadow: 0 0 20px 0 black
      font-family: IcelandRegular
      border: 1px solid white
    .my-custom-tooltip.bs-tooltip-end .tooltip-arrow::before
      border-right-color: $color
    .my-custom-tooltip.bs-tooltip-start .tooltip-arrow::before
      border-left-color: $color
    .my-custom-tooltip.bs-tooltip-top .tooltip-arrow::before
      border-top-color: $color
    .my-custom-tooltip.bs-tooltip-bottom .tooltip-arrow::before
      border-bottom-color: $color
  `]
})
export class HardAndSoftSkillsComponent implements OnInit {
  private _success = new Subject<any>();
  hardSkills: HardSkills[] = [];
  levelSkills: LevelSkills[] = [];
  softSkills: SoftSkills[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  classCol: string[] = [];
  classProgress: string[][] = [];
  checkboxSeleccionados: boolean[] = new Array(17);
  checkboxSeleccionados2: boolean[] = new Array(10);
  selectSeleccionados: string[] = new Array(17);
  window = window;
  loading: boolean[] = [false, false, false];

  @ViewChild('modalSkills', { static: false }) modalSkills?: ModalComponent;
  @ViewChild('dangerAlert', { static: false }) dangerAlert?: NgbAlert;
  @ViewChild('successAlert', { static: false }) successAlert?: NgbAlert;

  private consultarTablaHabilidadesDuras(): void {
    const ROUTE_PARAM = this.route.snapshot.paramMap;
    const USERNAME: string | any = ROUTE_PARAM.get('username');

    this.loading[1] = true;
    this.fetch.getServer(`api/portfolio/hardskills/get_hardskills/${USERNAME}`).subscribe({
      next: (res: any) => {
        this.loading[1] = false;
        this.hardSkills = res;
        this.classCol = [];
        this.checkboxSeleccionados.fill(false);;
        this.hardSkills.forEach((e) => {
          switch (e.nombre) {
            case 'Arduino':
              this.classCol.push('bg-gradient-arduino');
              this.checkboxSeleccionados[0] = true;
              break;
            case 'c++':
              this.classCol.push('bg-gradient-cpp');
              this.checkboxSeleccionados[1] = true;
              break;
            case 'C#':
              this.classCol.push('bg-gradient-csharp');
              this.checkboxSeleccionados[2] = true;
              break;
            case 'CSS':
              this.classCol.push('bg-gradient-css');
              this.checkboxSeleccionados[3] = true;
              break;
            case 'HTML':
              this.classCol.push('bg-gradient-html');
              this.checkboxSeleccionados[4] = true;
              break;
            case 'DOTNET':
              this.classCol.push('bg-gradient-dotnet');
              this.checkboxSeleccionados[5] = true;
              break;
            case 'GIT':
              this.classCol.push('bg-gradient-git');
              this.checkboxSeleccionados[6] = true;
              break;
            case 'GTK':
              this.classCol.push('bg-gradient-gtk');
              this.checkboxSeleccionados[7] = true;
              break;
            case 'JavaScript':
              this.classCol.push('bg-gradient-js');
              this.checkboxSeleccionados[8] = true;
              break;
            case 'Linux':
              this.classCol.push('bg-gradient-linux');
              this.checkboxSeleccionados[9] = true;
              break;
            case 'MySQL':
              this.classCol.push('bg-gradient-mysql');
              this.checkboxSeleccionados[10] = true;
              break;
            case 'PHP':
              this.classCol.push('bg-gradient-php');
              this.checkboxSeleccionados[11] = true;
              break;
            case 'TypeScript':
              this.classCol.push('bg-gradient-ts');
              this.checkboxSeleccionados[12] = true;
              break;
            case 'Java':
              this.classCol.push('bg-gradient-java');
              this.checkboxSeleccionados[13] = true;
              break;
            case 'Angular':
              this.classCol.push('bg-gradient-angular');
              this.checkboxSeleccionados[14] = true;
              break;
            case 'Bootstrap':
              this.classCol.push('bg-gradient-bootstrap');
              this.checkboxSeleccionados[15] = true;
              break;
            case 'Spring':
              this.classCol.push('bg-gradient-spring');
              this.checkboxSeleccionados[16] = true;
              break;
          }
        });
      },
      error: () => {
        this.loading[1] = false;
        console.error('HardSkills: Request failed with error');
      },
      complete: () => {
        console.log('HardSkills: Request completed')
      }
    });
  }

  private consultarTablaHabilidadesNivel(): void {
    const ROUTE_PARAM = this.route.snapshot.paramMap;
    const USERNAME: string | any = ROUTE_PARAM.get('username');

    this.loading[1] = true;
    this.fetch.getServer(`api/portfolio/levelskills/get_levelskills/${USERNAME}`).subscribe({
      next: (res: any) => {
        this.loading[1] = false;
        this.classProgress = [];
        this.selectSeleccionados.fill('');
        this.levelSkills = res;
        this.levelSkills.forEach((e) => {
          switch (e.nombre) {
            case 'BÁSICO':
              this.classProgress.push([
                'bg-gradient-danger',
                'bg-danger',
                'font-size:.9rem;width:30%;font-weight:bold'
              ]);
              this.selectSeleccionados[(e.id !== undefined) ? e.id - 1 : 0] = '1';
              break;
            case 'INTERMEDIO':
              this.classProgress.push([
                'bg-gradient-warning',
                'bg-warning text-dark',
                'font-size:.9rem;width:50%;font-weight:bold'
              ]);
              this.selectSeleccionados[(e.id !== undefined) ? e.id - 1 : 0] = '2';
              break;
            case 'AVANZADO':
              this.classProgress.push([
                'bg-gradient-warning',
                'bg-success',
                'font-size:.9rem;width:100%;font-weight:bold'
              ]);
              this.selectSeleccionados[(e.id !== undefined) ? e.id - 1 : 0] = '3';
              break;
          }
        });
      },
      error: () => {
        this.loading[1] = false;
        console.error('LevelSkills: Request failed with error');
      },
      complete: () => {
        console.log('LevelSkills: Request completed')
      }
    });
  }

  private consultarTablaHabilidadesBlandas(): void {
    const ROUTE_PARAM = this.route.snapshot.paramMap;
    const USERNAME: string | any = ROUTE_PARAM.get('username');

    this.loading[2] = true;
    this.fetch.getServer(`api/portfolio/softskills/get_softskills/${USERNAME}`).subscribe({
      next: (res: any) => {
        this.loading[2] = false;
        this.softSkills = res;
        this.checkboxSeleccionados2.fill(false);
        this.softSkills.forEach((e) => {
          switch (e.nombre) {
            case 'Trabajo en Equipo':
              this.checkboxSeleccionados2[0] = true;
              break;
            case 'Comunicación':
              this.checkboxSeleccionados2[1] = true;
              break;
            case 'Pensamiento Análitico':
              this.checkboxSeleccionados2[2] = true;
              break;
            case 'Gestión del Tiempo':
              this.checkboxSeleccionados2[3] = true;
              break;
            case 'Resolución de Conflictos':
              this.checkboxSeleccionados2[4] = true;
              break;
            case 'Autonomía':
              this.checkboxSeleccionados2[5] = true;
              break;
            case 'Ganas de Aprender':
              this.checkboxSeleccionados2[6] = true;
              break;
            case 'Inteligencia Emocional':
              this.checkboxSeleccionados2[7] = true;
              break;
            case 'Toma de Decisiones':
              this.checkboxSeleccionados2[8] = true;
              break;
            case 'Flexibilidad':
              this.checkboxSeleccionados2[9] = true;
              break;
          }
        });
      },
      error: () => {
        this.loading[2] = false;
        console.error('SoftSkills: Request failed with error');
      },
      complete: () => {
        console.log('SoftSkills: Request completed')
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

    this.consultarTablaHabilidadesNivel();
    this.consultarTablaHabilidadesDuras();
    this.consultarTablaHabilidadesBlandas();
  }

  agregar() {
    const MODAL = this.modalSkills?.openVerticallyCentered(this.modalSkills?.content);

    this.modalSkills?.setTitleModal('Habilidades Duras 😏');
    this.modalSkills?.generateSelectCheckBox(new InputSelectCheckBox('Seleccionar una o varias habilidades duras 😏', LIST_HARD_SKILLS, this.formBuilder.group({
      arduino: new FormControl(this.checkboxSeleccionados[0]),
      level1: new FormControl({ value: this.selectSeleccionados[0], disabled: (this.selectSeleccionados[0] === '') }, [Validators.required]),
      cpp: new FormControl(this.checkboxSeleccionados[1]),
      level2: new FormControl({ value: this.selectSeleccionados[1], disabled: (this.selectSeleccionados[1] === '') }, [Validators.required]),
      csharp: new FormControl(this.checkboxSeleccionados[2]),
      level3: new FormControl({ value: this.selectSeleccionados[2], disabled: (this.selectSeleccionados[2] === '') }, [Validators.required]),
      css: new FormControl(this.checkboxSeleccionados[3]),
      level4: new FormControl({ value: this.selectSeleccionados[3], disabled: (this.selectSeleccionados[3] === '') }, [Validators.required]),
      html: new FormControl(this.checkboxSeleccionados[4]),
      level5: new FormControl({ value: this.selectSeleccionados[4], disabled: (this.selectSeleccionados[4] === '') }, [Validators.required]),
      dotnet: new FormControl(this.checkboxSeleccionados[5]),
      level6: new FormControl({ value: this.selectSeleccionados[5], disabled: (this.selectSeleccionados[5] === '') }, [Validators.required]),
      git: new FormControl(this.checkboxSeleccionados[6]),
      level7: new FormControl({ value: this.selectSeleccionados[6], disabled: (this.selectSeleccionados[6] === '') }, [Validators.required]),
      gtk: new FormControl(this.checkboxSeleccionados[7]),
      level8: new FormControl({ value: this.selectSeleccionados[7], disabled: (this.selectSeleccionados[7] === '') }, [Validators.required]),
      js: new FormControl(this.checkboxSeleccionados[8]),
      level9: new FormControl({ value: this.selectSeleccionados[8], disabled: (this.selectSeleccionados[8] === '') }, [Validators.required]),
      linux: new FormControl(this.checkboxSeleccionados[9]),
      level10: new FormControl({ value: this.selectSeleccionados[9], disabled: (this.selectSeleccionados[9] === '') }, [Validators.required]),
      mysql: new FormControl(this.checkboxSeleccionados[10]),
      level11: new FormControl({ value: this.selectSeleccionados[10], disabled: (this.selectSeleccionados[10] === '') }, [Validators.required]),
      php: new FormControl(this.checkboxSeleccionados[11]),
      level12: new FormControl({ value: this.selectSeleccionados[11], disabled: (this.selectSeleccionados[11] === '') }, [Validators.required]),
      ts: new FormControl(this.checkboxSeleccionados[12]),
      level13: new FormControl({ value: this.selectSeleccionados[12], disabled: (this.selectSeleccionados[12] === '') }, [Validators.required]),
      java: new FormControl(this.checkboxSeleccionados[13]),
      level14: new FormControl({ value: this.selectSeleccionados[13], disabled: (this.selectSeleccionados[13] === '') }, [Validators.required]),
      angular: new FormControl(this.checkboxSeleccionados[14]),
      level15: new FormControl({ value: this.selectSeleccionados[14], disabled: (this.selectSeleccionados[14] === '') }, [Validators.required]),
      bootstrap: new FormControl(this.checkboxSeleccionados[15]),
      level16: new FormControl({ value: this.selectSeleccionados[15], disabled: (this.selectSeleccionados[15] === '') }, [Validators.required]),
      spring: new FormControl(this.checkboxSeleccionados[16]),
      level17: new FormControl({ value: this.selectSeleccionados[16], disabled: (this.selectSeleccionados[16] === '') }, [Validators.required]),
    }), (formulario: FormGroup) => {
      let auxCheckBox = false;
      let contador = 0;
      const ROUTE_PARAM = this.route.snapshot.paramMap;
      const USERNAME: string | any = ROUTE_PARAM.get('username');

      LIST_HARD_SKILLS.forEach((e) => {
        if (formulario.get(e.checkbox.formControlName)?.value) {
          if (e.select.formControlName !== undefined) {
            if (auxCheckBox === false)
              auxCheckBox = true;
            const ID_HARD_SKILLS: number = Number(document.getElementById(e.checkbox.formControlName)?.getAttribute('data-id'));
            const ID_LEVEL_SKILLS: number = Number(formulario.get(e.select.formControlName)?.value);
            const ID_PORTFOLIO_HARD_SKILLS: HTMLDivElement | any = document.getElementById('PHS-' + contador);
            contador++;

            this.loading[0] = true;
            document.body.style.overflowY = 'hidden';

            this.fetch.postServerParams(
              'api/portfolio/hardskills/save',
              new HttpParams()
                .append('username', USERNAME)
                .append('idPortfolioHabilidadesDuras', (ID_PORTFOLIO_HARD_SKILLS === null) ? 0 : ID_PORTFOLIO_HARD_SKILLS?.getAttribute('data-id'))
                .append('idHardSkills', ID_HARD_SKILLS)
                .append('idLevelSkills', ID_LEVEL_SKILLS)
            ).subscribe({
              next: (data) => {
                this.loading[0] = false;
                document.body.style.overflowY = 'scroll';
                this.successMessage = data.message;
                this.consultarTablaHabilidadesNivel();
                this.consultarTablaHabilidadesDuras();
                this._success.next('');
                MODAL?.close('Close click');
              },
              error: (error) => {
                this.loading[0] = false;
                document.body.style.overflowY = 'scroll';
                console.error('HardSkills: Request failed with error');
                this.errorMessage = error.error.status + " " + error.error.error + " " + error.error.message;
                this._success.next('');
              },
              complete: () => {
                console.log('HardSkills: Request completed')
              }
            });
          }
        }
      });

      if (!auxCheckBox) {
        this.errorMessage = 'Seleccione al menos un opción';
        this._success.next('');
      }
    }));
  }

  eliminar(element: HTMLDivElement): void {
    const ID: number = Number(element.getAttribute('data-id'));
    this.loading[0] = true;
    document.body.style.overflowY = 'hidden';
    this.fetch.deleteServer(`api/portfolio/hardskills/delete/${ID}`).subscribe({
      next: (data) => {
        this.loading[0] = false;
        document.body.style.overflowY = 'scroll';
        this.successMessage = data.message;
        this.consultarTablaHabilidadesNivel();
        this.consultarTablaHabilidadesDuras();
        this._success.next('');
      },
      error: (error) => {
        this.loading[0] = false;
        document.body.style.overflowY = 'scroll';
        console.error('HardSkills: Request failed with error');
        this.errorMessage = error.error.status + " " + error.error.error + " " + error.error.message;
        this._success.next('');
      },
      complete: () => {
        console.log('HardSkills: Request completed')
      }
    });
  }

  agregarSoftSkills() {
    const MODAL = this.modalSkills?.openVerticallyCentered(this.modalSkills?.content);

    this.modalSkills?.setTitleModal('Habilidades Blandas 🧐');
    this.modalSkills?.generateCheckBox(new InputCheckBox('Seleccionar una o varias habilidades blandas 🧐', [{
      formControlName: 'teamwork',
      label: 'Trabajo en Equipo',
      value: '1'
    }, {
      formControlName: 'communication',
      label: 'Comunicación',
      value: '2'
    }, {
      formControlName: 'athinking',
      label: 'Pensamiento Análitico',
      value: '3'
    }, {
      formControlName: 'tmanagement',
      label: 'Gestión del Tiempo',
      value: '4'
    }, {
      formControlName: 'cresolution',
      label: 'Resolución de Conflictos',
      value: '5'
    }, {
      formControlName: 'autonomy',
      label: 'Autonomía',
      value: '6'
    }, {
      formControlName: 'etolearn',
      label: 'Ganas de Aprender',
      value: '7'
    }, {
      formControlName: 'eintelligence',
      label: 'Inteligencia Emocional',
      value: '8'
    }, {
      formControlName: 'dmaking',
      label: 'Toma de Decisiones',
      value: '9'
    }, {
      formControlName: 'flexibility',
      label: 'Flexibilidad',
      value: '10'
    }], this.formBuilder.group({
      teamwork: new FormControl(this.checkboxSeleccionados2[0]),
      communication: new FormControl(this.checkboxSeleccionados2[1]),
      athinking: new FormControl(this.checkboxSeleccionados2[2]),
      tmanagement: new FormControl(this.checkboxSeleccionados2[3]),
      cresolution: new FormControl(this.checkboxSeleccionados2[4]),
      autonomy: new FormControl(this.checkboxSeleccionados2[5]),
      etolearn: new FormControl(this.checkboxSeleccionados2[6]),
      eintelligence: new FormControl(this.checkboxSeleccionados2[7]),
      dmaking: new FormControl(this.checkboxSeleccionados2[8]),
      flexibility: new FormControl(this.checkboxSeleccionados2[9])
    }), (formulario: FormGroup) => {
      let auxCheckBox = false;
      let contador = 0;
      const ROUTE_PARAM = this.route.snapshot.paramMap;
      const USERNAME: string | any = ROUTE_PARAM.get('username');

      Object.keys(formulario.controls).forEach((e) => {
        if (formulario.controls[e].value) {
          if (auxCheckBox === false)
            auxCheckBox = true;

          const ID_SOFT_SKILLS: number = Number(document.getElementById(e)?.getAttribute('data-id'));
          const ID_PORTFOLIO_SOFT_SKILLS: HTMLDivElement | any = document.getElementById('PSS-' + contador);
          contador++;

          this.loading[0] = true;
          document.body.style.overflowY = 'hidden';

          this.fetch.postServerParams(
            'api/portfolio/softskills/save',
            new HttpParams()
              .append('username', USERNAME)
              .append('idPortfolioHabilidadesBlandas', (ID_PORTFOLIO_SOFT_SKILLS === null) ? 0 : ID_PORTFOLIO_SOFT_SKILLS?.getAttribute('data-id'))
              .append('idSoftSkills', ID_SOFT_SKILLS)
          ).subscribe({
            next: (data) => {
              this.loading[0] = false;
              document.body.style.overflowY = 'scroll';
              this.successMessage = data.message;
              this.consultarTablaHabilidadesBlandas();
              this._success.next('');
              MODAL?.close('Close click');
            },
            error: (error) => {
              this.loading[0] = false;
              document.body.style.overflowY = 'scroll';
              console.error('HardSkills: Request failed with error');
              this.errorMessage = error.error.status + " " + error.error.error + " " + error.error.message;
              this._success.next('');
            },
            complete: () => {
              console.log('HardSkills: Request completed')
            }
          });
        }
      });

      if (!auxCheckBox) {
        this.errorMessage = 'Seleccione al menos un opción';
        this._success.next('');
      }
    }));
  }

  eliminarSoftSkills(element: HTMLDivElement): void {
    const ID: number = Number(element.getAttribute('data-id'));
    this.loading[0] = true;
    document.body.style.overflowY = 'hidden';
    this.fetch.deleteServer(`api/portfolio/softskills/delete/${ID}`).subscribe({
      next: (data) => {
        this.loading[0] = false;
        document.body.style.overflowY = 'scroll';
        this.successMessage = data.message;
        this.consultarTablaHabilidadesBlandas();
        this._success.next('');
      },
      error: (error) => {
        this.loading[0] = false;
        document.body.style.overflowY = 'scroll';
        console.error('HardSkills: Request failed with error');
        this.errorMessage = error.error.status + " " + error.error.error + " " + error.error.message;
        this._success.next('');
      },
      complete: () => {
        console.log('HardSkills: Request completed')
      }
    });
  }
}
