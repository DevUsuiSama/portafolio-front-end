import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelComponent } from './components/auth/panel/panel.component';
import { PortfolioComponent } from './components/auth/portfolio/portfolio.component';
import { Erro404Component } from './components/erro404/erro404.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { SignupComponent } from './components/signup/signup.component';
import { GuardGuard } from './service/guard.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'privacy_policy', component: PrivacyPolicyComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'portfolio/:username', component: PortfolioComponent, canActivate: [GuardGuard] },
  { path: 'panel', component: PanelComponent, canActivate: [GuardGuard] },
  { path: '**', pathMatch: 'full', component: Erro404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
