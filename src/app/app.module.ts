// Developed by Houlak
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HTTP_INTERCEPTORS,  HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CookieService } from 'ngx-cookie-service';
// angular material design
import { MatToolbarModule, MatTabsModule, MatButtonModule,
         MatDialogModule, MatProgressSpinnerModule, MatListModule,
         MatIconModule, MatCardModule, MatTableModule, MatDialog, MatFormFieldModule,
         MatExpansionModule, MatSidenavModule, MatMenuModule,
         MatInputModule, MatSelectModule, MatOptionModule, MatChipsModule,
         MatStepperModule, MatCheckboxModule } from '@angular/material';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// bootstrap angular
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
// covalent
import { CovalentLayoutModule, CovalentStepsModule, CovalentSearchModule,
         CovalentDataTableModule, CovalentPagingModule, CovalentLoadingModule, CovalentFileModule } from '@covalent/core';
import { CovalentCommonModule } from '@covalent/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RequestsComponent } from './requests/requests.component';
import { RequestsDetailComponent } from './requests/requests-detail/requests-detail.component';
import { RateConsumerDialog } from './sales/rate-consumer/rate-consumer.component';
import { ShowBillsDialog, ShowBillDialog } from './account/account.component';

// components
import { AccountComponent } from './account/account.component';
import { ContactComponent } from './contact/contact.component';
import { FaqComponent } from './faq/faq.component';
import { SalesComponent } from './sales/sales.component';
import { LoginComponent } from './login-signup/login/login.component';
import { SignupComponent } from './login-signup/signup/signup.component';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { OffersDetailComponent } from './offers/offers-detail/offers-detail.component';
import { OffersComponent } from './offers/offers.component';
import { EditProfileComponent } from './account/edit-profile/edit-profile.component';
import { RestorePwdComponent } from './restore-pwd/restore-pwd.component';
import { SelectProfileImageDialog } from './profile-image/profile-image.component';
import { SalesDetailComponent } from './sales/sales-detail/sales-detail.component';
import { ForgotPwdComponent } from './forgot-pwd/forgot-pwd.component';
import { FilterMoreElementsDialog } from './filters/filter-more/filter-more-elements.component';

import { ImageCropperModule } from 'ngx-image-cropper';

// services
import { RequestService } from './requests/request.service';
import { OfferService } from './offers/offer.service';
import { AuthService } from './auth/auth.service';
import { AuthGuardService } from './auth/auth-guard.service';
import { ErrorInterceptorService } from './messages/error-interceptor.service';
import { MessageDialog, ShowDialogService } from './messages/show-dialog.service';
import { SaleService } from './sales/sales.service';
import { AccountService } from './account/account.service';
import { S3ManagerService } from './s3-manager.service';
import { FilterService } from './filters/filters.service';
import { ChangePasswordComponent } from './account/change-password/change-password.component';
import { MakeOfferDialog } from './offers/make-offer/make-offer.component';
import { OfferSummaryDialog } from './offers/summary/offer-summary.component';
import { AskQuestionDialog } from './offers/ask-question/ask-question.component';
import { ZonesService } from './login-signup/signup/zones.service';


@NgModule({
  declarations: [
    AppComponent,
    RequestsComponent,
    RequestsDetailComponent,
    AccountComponent,
    ContactComponent,
    FaqComponent,
    MakeOfferDialog,
    MessageDialog,
    OfferSummaryDialog,
    RateConsumerDialog,
    SelectProfileImageDialog,
    ShowBillsDialog,
    ShowBillDialog,
    FilterMoreElementsDialog,
    AskQuestionDialog,
    SalesComponent,
    LoginComponent,
    SignupComponent,
    OffersDetailComponent,
    OffersComponent,
    SalesDetailComponent,
    EditProfileComponent,
    RestorePwdComponent,
    SelectProfileImageDialog,
    ForgotPwdComponent,
    LoginSignupComponent,
    ChangePasswordComponent
  ],
  entryComponents: [
    MakeOfferDialog, MessageDialog, OfferSummaryDialog, RateConsumerDialog, SelectProfileImageDialog,
    ShowBillsDialog, ShowBillDialog, FilterMoreElementsDialog, AskQuestionDialog
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    FlexLayoutModule,
    // angular material
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatTabsModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatChipsModule,
    MatExpansionModule,
    MatSidenavModule,
    MatMenuModule,
    MatStepperModule,
    MatCheckboxModule,
    // bootstrap angular
    NgbModule.forRoot(),
    // teradata
    CovalentCommonModule,
    CovalentLayoutModule,
    CovalentStepsModule,
    CovalentSearchModule,
    CovalentDataTableModule,
    CovalentPagingModule,
    CovalentLoadingModule,
    CovalentFileModule,
    ImageCropperModule,
  ],
  providers: [RequestService, OfferService, AuthService, AuthGuardService, CookieService,
      ShowDialogService, SaleService, AccountService, S3ManagerService, FilterService, ZonesService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: ErrorInterceptorService,
        multi: true
      }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
