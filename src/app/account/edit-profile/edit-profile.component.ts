// Developed by Houlak
import { Component, OnInit } from '@angular/core';
import { S3ManagerService } from '../../s3-manager.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '../account.service';
import { ShowDialogService } from '../../messages/show-dialog.service';

import { TdLoadingService } from '@covalent/core';
import { MessageType } from '../../messages/message-type.enum';
import { ZonesService } from '../../login-signup/signup/zones.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  selectedFiles: FileList;

  profileImage;

  provider;

  zones;

  constructor(private sanitizer: DomSanitizer, private s3ManagerService: S3ManagerService, private accountService: AccountService,
    private showDialogService: ShowDialogService, private _loadingService: TdLoadingService, private zonesService: ZonesService) {
    this.loadProvider()
    this.getZones()
  }

  ngOnInit() {
  }

  loadProvider() {
    this.accountService.getProvider().subscribe(
      provider => {
        console.log(provider);
        this.provider = provider
      }
    );
  }

  getZones() {
    this.zonesService.getZones().subscribe(
      res => {
        this.zones = res
        console.log(this.zones)
      }
    )
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  saveChanges() {
    this._loadingService.register('saveChangesLoading');
    console.log("EDIT " + JSON.stringify(this.provider));
    this.accountService.editProvider(this.provider).subscribe(res => {
      this.showDialogService.showMessageDialog("Tu perfil ha sido actualizado", MessageType.success, () => {
        this._loadingService.resolve('saveChangesLoading');
      })
    })
  }
/*
  getErrorMessage() {
    return this.signupForm.controls.email.hasError('required') ? 'Debes ingresar un email' :
        this.signupForm.controls.email.hasError('email') ? 'Ingresa un email válido' :
            '';
  }*/
}
