import { HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, Subject } from 'rxjs';
import { FetchService } from 'src/app/service/fetch.service';
import { ModalComponent } from '../../modal/modal.component';
import { NavComponent } from '../../nav/nav.component';
import { Img } from './img';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.sass']
})
export class PortfolioComponent implements AfterViewInit, OnInit {
  private _success = new Subject<any>();
  imgBanner: Img = new Img;
  imgProfile: Img = new Img;
  errorMessage: string = '';
  successMessage: string = '';
  loading: boolean = false;

  @ViewChild(NavComponent) nav?: NavComponent;
  @ViewChild('edit', { static: false }) edit?: ModalComponent;
  @ViewChild('dangerAlert', { static: false }) dangerAlert?: NgbAlert;
  @ViewChild('successAlert', { static: false }) successAlert?: NgbAlert;

  constructor(
    private formBuilder: FormBuilder,
    private fetch: FetchService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    let profile: HTMLDivElement | any = document.getElementById('profile');
    let rule = () => {
      if (window.innerWidth < 1040)
        profile.style.left = '20px';
      else
        profile.style.left = '80px';
    }

    rule();

    window.addEventListener('resize', () => {
      rule();
    });

    this._success.pipe(debounceTime(6000)).subscribe(() => {
      if (this.dangerAlert)
        this.dangerAlert.close();
      if (this.successAlert)
        this.successAlert.close();
    });

    const ROUTER_PARAM = this.route.snapshot.paramMap;
    const USERNAME: string | any = ROUTER_PARAM.get('username');

    this.fetch.getServer(`api/portfolio/banner/get_url/${USERNAME}`).subscribe({
      next: (res: any) => {
        this.imgBanner.src = res.text;
        this.imgBanner.alt = 'banner';
      },
      error: () => {
        console.error('Banner: Request failed with error');
      },
      complete: () => {
        console.log('Banner: Request completed')
      }
    });

    this.fetch.getServer(`api/portfolio/profile_picture/get_url/${USERNAME}`).subscribe({
      next: (res: any) => {
        this.imgProfile.src = res.text;
        this.imgProfile.alt = 'profile';
      },
      error: () => {
        console.error('ProfilePicture: Request failed with error');
      },
      complete: () => {
        console.log('ProfilePicture: Request completed')
      }
    });
  }

  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      this.nav?.navItem([{
        nav: 1,
        routerLink: '.',
        name: 'Acerca de Mí',
        icon: 'person',
        lambda: () => {
          const yOffset = -100;
          const element: HTMLElement | any = document.getElementById('aboutme');
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, {
        nav: 1,
        routerLink: '.',
        name: 'Experiencia',
        icon: 'work',
        lambda: () => {
          const yOffset = -100;
          const element: HTMLElement | any = document.getElementById('experience');
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, {
        nav: 1,
        routerLink: '.',
        name: 'Educación',
        icon: 'school',
        lambda: () => {
          const yOffset = -100;
          const element: HTMLElement | any = document.getElementById('education');
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, {
        nav: 1,
        routerLink: '.',
        name: 'Hard & Soft Skills',
        icon: 'engineering',
        lambda: () => {
          const yOffset = -100;
          const element: HTMLElement | any = document.getElementById('hardandsoftskills');
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, {
        nav: 1,
        routerLink: '.',
        name: 'Proyectos',
        icon: 'list_alt',
        lambda: () => {
          const yOffset = -100;
          const element: HTMLElement | any = document.getElementById('project');
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, {
        nav: 2,
        routerLink: '',
        name: 'Volver',
        icon: 'arrow_back',
        lambda: () => { }
      }]);
    });
  }

  editarBanner() {
    const MODAL = this.edit?.openVerticallyCentered(this.edit?.content);

    this.edit?.setTitleModal('Banner');
    this.edit?.generateInput([{
      type: 'text',
      formControlName: 'banner',
      placeholder: 'Link de una imagén',
      span: 'Agregar un link de una imagén'
    }], this.formBuilder.group({
      banner: new FormControl(this.imgBanner.src, [Validators.required, Validators.pattern(/https:\/\/[\w\.\/\-\=]+/)])
    }), (form: any) => {
      const ROUTE_PARAM = this.route.snapshot.paramMap;
      const USERNAME: string | any = ROUTE_PARAM.get('username');

      this.loading = true;
      document.body.style.overflowY = 'hidden';

      this.fetch.postServerParams('api/portfolio/banner/save',
        new HttpParams()
          .append('username', USERNAME)
          .append('url', form.get('banner').value)
      ).subscribe({
        next: (data) => {
          this.loading = false;
          document.body.style.overflowY = 'scroll';
          this.successMessage = data.message;
          this.imgBanner.src = form.get('banner').value;
          this.imgBanner.alt = 'banner';
          this._success.next('');
          MODAL?.close('Close click');
        },
        error: (error) => {
          this.loading = false;
          document.body.style.overflowY = 'scroll';
          console.error('Banner: Request failed with error');
          this.errorMessage = error.error.status + " " + error.error.error + " " + error.error.message;
          this._success.next('');
        },
        complete: () => {
          console.log('Banner: Request completed')
        }
      });
    });
  }

  editarProfile() {
    const MODAL = this.edit?.openVerticallyCentered(this.edit?.content);

    this.edit?.setTitleModal('Perfil');
    this.edit?.generateInput([{
      type: 'text',
      formControlName: 'profile',
      placeholder: 'Link de una foto',
      span: 'Agregar un link de una foto'
    }], this.formBuilder.group({
      profile: new FormControl(this.imgProfile.src, [Validators.required, Validators.pattern(/https:\/\/[\w\.\/\-\=]+/)])
    }), (form: any) => {
      const ROUTE_PARAM = this.route.snapshot.paramMap;
      const USERNAME: string | any = ROUTE_PARAM.get('username');
      
      this.loading = true;
      document.body.style.overflowY = 'hidden';
      
      this.fetch.postServerParams('api/portfolio/profile_picture/save',
        new HttpParams()
          .append('username', USERNAME)
          .append('url', form.get('profile').value)
      ).subscribe({
        next: (data) => {
          this.loading = false;
          document.body.style.overflowY = 'scroll';
          this.successMessage = data.message;
          this.imgProfile.src = form.get('profile').value;
          this.imgProfile.alt = 'profile';
          this._success.next('');
          MODAL?.close('Close click');
        },
        error: (error) => {
          this.loading = false;
          document.body.style.overflowY = 'scroll';
          console.error('ProfilePicture: Request failed with error');
          this.errorMessage = error.error.status + " " + error.error.error + " " + error.error.message;
          this._success.next('');
        },
        complete: () => {
          console.log('ProfilePicture: Request completed')
        }
      });
    });
  }

}
