// Developed by Houlak
import { Component, OnInit } from '@angular/core';
import { TdLoadingService } from '@covalent/core';
import { MessageType } from '../messages/message-type.enum';

// services
import { AuthService } from '../auth/auth.service';
import { ShowDialogService } from '../messages/show-dialog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-pwd',
  templateUrl: './forgot-pwd.component.html',
  styleUrls: ['./forgot-pwd.component.scss']
})
export class ForgotPwdComponent implements OnInit {
  email = '';
  done = false;
  buttonHidden = false;

  constructor(public auth: AuthService, private showDialogService: ShowDialogService,
              private _loadingService: TdLoadingService, private router: Router) {  }

  ngOnInit() {
  }

  submit() {
    this._loadingService.register('loading');
    this.auth.forgotPwd(this.email).subscribe(
      res => {
        this._loadingService.resolve('loading');
        this.buttonHidden = true;
        return this.showDialogService.showMessageDialog(
          'Te enviaremos un mail a la brevedad con los pasos a seguir para restablecer tu contraseña',
          MessageType.success, () => {
            this.router.navigate(['login']);
          }
        )
      }, (err) => {
        this._loadingService.resolve('loading')
      }
    )
  }

}
