// Developed by Houlak
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';
import { ShowDialogService } from '../../messages/show-dialog.service';

import { TdLoadingService } from '@covalent/core';
import { MessageType } from '../../messages/message-type.enum';



@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  oldPwd = ''
  newPwd1 = ''
  newPwd2 = ''

  constructor(private accountService: AccountService,  public router: Router,
              private showDialogService: ShowDialogService, private _loadingService: TdLoadingService) {
  }

  ngOnInit() {
  }


  changePwd() {
    if (this.newPwd1.length < 6) {
      return this.showDialogService.showMessageDialog('La contraseña debe tener al menos 6 caracteres', MessageType.success, () => {})
    }

    if (this.newPwd1 != this.newPwd2) {
      return this.showDialogService.showMessageDialog('Las contraseñas no coinciden', MessageType.success, () => {})
    }

    this._loadingService.register('loading');
    this.accountService.changePwd(this.oldPwd, this.newPwd1).subscribe(
      res => {
        this.showDialogService.showMessageDialog('Contraseña actualizada correctamente', MessageType.success, () => {
          this._loadingService.resolve('loading');
          this.router.navigate(['account']);
        })
      },
      err => {
        console.log(err)
        this._loadingService.resolve('loading')
      }
    )
  }

}
