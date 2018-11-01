// Developed by Houlak
// angular
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
// services
import { AuthService } from '../auth/auth.service';
import { ShowDialogService } from '../messages/show-dialog.service';
// models
import { MessageType } from '../messages/message-type.enum';

import { hashPwd } from '../common';

@Component({
  selector: 'app-restore-pwd',
  templateUrl: './restore-pwd.component.html',
  styleUrls: ['./restore-pwd.component.scss']
})
export class RestorePwdComponent implements OnInit {
  pwd1 = '';
  pwd2 = '';
  resetPwdToken = '';
  isProvider: boolean;
  hidePwd = true;
  done = false;

  constructor(public auth: AuthService, public router: Router, private activatedRoute: ActivatedRoute,
              private showDialogService: ShowDialogService) {}

  ngOnInit() {
    // subscribe to router event
    this.activatedRoute.params.subscribe((params: Params) => {
      this.resetPwdToken = params['token'];
      this.isProvider = params['provider'] == 'true';
      console.log(`provider: ${this.isProvider}`)
    });
  }

  submit() {
    if (this.pwd1.length < 6) {
      return this.showDialogService.showMessageDialog('La contraseña debe tener al menos 6 caracteres', MessageType.error, () => {})
    }
    if (this.pwd1 != this.pwd2) {
      return this.showDialogService.showMessageDialog('Las contraseñas no coinciden', MessageType.error, () => {})
    }

    let hashedPwd = hashPwd(this.pwd1)
    this.auth.restorePwd(hashedPwd, this.resetPwdToken).subscribe(
      res => {
        return this.showDialogService.showMessageDialog(
          'La contraseña se actualizó correctamente',
          MessageType.success,
          () => {
            if (this.isProvider) {
              this.router.navigate(['login'])
            } else {
              this.done = true;
            }
          }
        )
      }
    )
  }

}
