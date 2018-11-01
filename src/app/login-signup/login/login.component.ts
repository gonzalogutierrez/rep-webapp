// Developed by Houlak
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { TdLoadingService } from '@covalent/core';

// services
import { AuthService } from '../../auth/auth.service';
import { CookieService } from 'ngx-cookie-service';
// models
import { Provider } from '../../account/provider.model';
import { ShowDialogService } from '../../messages/show-dialog.service';
import { MessageType } from '../../messages/message-type.enum';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  provider;

  hidePwd = true;

  constructor(private authService: AuthService, private cookieService: CookieService, private router: Router,
    public dialog: MatDialog, private _loadingService: TdLoadingService, private dialogService: ShowDialogService) {
    this.loginForm = new FormGroup({
      email: new FormControl('', []),
      password: new FormControl('', [])
    });
  }

  ngOnInit() {
  }

  getErrorMessage() {
    return this.loginForm.controls.email.hasError('required') ? 'Debes ingresar un email' :
      this.loginForm.controls.email.hasError('email') ? 'Ingresa un email válido' :
        '';
  }

  login() {

    this._loadingService.register('loading');
    this.authService.login(this.loginForm.controls.email.value.trim(), this.loginForm.controls.password.value)
      .subscribe(
        res => this.load(res),
        err => this._loadingService.resolve('loading')
      )
  }

  load(provider) {
    console.log(provider);
    if (provider) {
      this.cookieService.set('cookie', provider.cookie, undefined, '/rep-webapp');
      this.cookieService.set('userId', provider.user.id, undefined, '/rep-webapp');
      this.provider = provider;
      this.router.navigate(['requests']);
    }
  }

}
