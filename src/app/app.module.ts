import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NoRightClickDirective } from './directive/no-right-click.directive';
import { HomeComponent } from './components/home/home.component';
import { FetchService } from './service/fetch.service';
import { InterceptorService } from './service/interceptor.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JWT_OPTIONS } from '@auth0/angular-jwt';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavComponent } from './components/nav/nav.component';
import { LoginComponent } from './components/login/login.component';
import { ModalComponent } from './components/modal/modal.component';
import { SignupComponent } from './components/signup/signup.component';
import { FormLoginComponent } from './components/login/formlogin/formlogin.component';
import { FormSignupComponent } from './components/signup/formsignup/formsignup.component';
import { PortfolioComponent } from './components/auth/portfolio/portfolio.component';
import { PanelComponent } from './components/auth/panel/panel.component';
import { DetailComponent } from './components/auth/portfolio/detail/detail.component';
import { AboutmeComponent } from './components/auth/portfolio/aboutme/aboutme.component';
import { ExperienceComponent } from './components/auth/portfolio/experience/experience.component';
import { EducationComponent } from './components/auth/portfolio/education/education.component';
import { HardAndSoftSkillsComponent } from './components/auth/portfolio/hard-and-soft-skills/hard-and-soft-skills.component';
import { SelectCheckBoxComponent } from './components/modal/select-check-box/select-check-box.component';
import { CheckBoxComponent } from './components/modal/check-box/check-box.component';
import { ProjectComponent } from './components/auth/portfolio/project/project.component';
import { HideElementByRolDirective } from './directive/hide-element-by-rol.directive';
import { RouterModule } from '@angular/router';
import { Erro404Component } from './components/erro404/erro404.component';
@NgModule({
  declarations: [
    AppComponent,
    NoRightClickDirective,
    HomeComponent,
    PrivacyPolicyComponent,
    FooterComponent,
    NavComponent,
    LoginComponent,
    ModalComponent,
    SignupComponent,
    FormLoginComponent,
    FormSignupComponent,
    PortfolioComponent,
    PanelComponent,
    DetailComponent,
    AboutmeComponent,
    ExperienceComponent,
    EducationComponent,
    HardAndSoftSkillsComponent,
    SelectCheckBoxComponent,
    CheckBoxComponent,
    ProjectComponent,
    HideElementByRolDirective,
    Erro404Component
  ],
  imports: [
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgbDatepickerModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    JwtHelperService,
    {
      provide: JWT_OPTIONS,
      useValue: JWT_OPTIONS,
    },
    FetchService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
