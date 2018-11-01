// Developed by Houlak
import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';
// import { LoginComponent } from './login/login.component';
// import { SignupComponent } from './signup/signup.component';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { RequestsComponent } from './requests/requests.component';
import { RequestsDetailComponent } from './requests/requests-detail/requests-detail.component';
import { AccountComponent } from './account/account.component';
import { FaqComponent } from './faq/faq.component';
import { ContactComponent } from './contact/contact.component';
import { SalesComponent } from './sales/sales.component';
import { SalesDetailComponent } from './sales/sales-detail/sales-detail.component';
import { OffersComponent } from './offers/offers.component';
import { OffersDetailComponent } from './offers/offers-detail/offers-detail.component';
import { EditProfileComponent } from './account/edit-profile/edit-profile.component';
import { ForgotPwdComponent } from './forgot-pwd/forgot-pwd.component';
import { RestorePwdComponent } from './restore-pwd/restore-pwd.component';
import { ChangePasswordComponent } from './account/change-password/change-password.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/requests',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginSignupComponent
  },
  {
    path: 'signup',
    component: LoginSignupComponent
  },
  {
    path: 'requests',
    component: RequestsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'requests/:id',
    component: RequestsDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'sales',
    component: SalesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'sales/:id',
    component: SalesDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'faq',
    component: FaqComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'contact',
    component: ContactComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'offers',
    component: OffersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'offers/:id',
    component: OffersDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'account/edit',
    component: EditProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'account/change_password',
    component: ChangePasswordComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'forgot_pwd',
    component: ForgotPwdComponent
  }, {
    path: 'restore_pwd',
    component: RestorePwdComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
