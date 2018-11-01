// Developed by Houlak
import { Component, OnInit, Inject, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import { MessageType } from '../../messages/message-type.enum';

import { SelectProfileImageDialog } from '../../profile-image/profile-image.component';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatHorizontalStepper, MatVerticalStepper } from '@angular/material';

// services 
import { AuthService } from '../../auth/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { ShowDialogService } from '../../messages/show-dialog.service';
import { TdLoadingService } from '@covalent/core';
import { S3ManagerService } from '../../s3-manager.service';
import { AccountService } from '../../account/account.service';

import * as jsSHA from 'jssha';
import { ZonesService } from './zones.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  @ViewChild(MatHorizontalStepper) horizontalStepper: MatHorizontalStepper;
  @ViewChild(MatVerticalStepper) verticalStepper: MatVerticalStepper;

  ngOnInit() { }

  userForm: FormGroup;
  businessForm: FormGroup;
  billingForm: FormGroup;

  hidePwd = true;

  provider;

  profileImage;

  zones;


  constructor(private authService: AuthService, private cookieService: CookieService, private router: Router,
    private showDialogService: ShowDialogService, private s3ManagerService: S3ManagerService, public dialog: MatDialog,
    private _loadingService: TdLoadingService, private accountService: AccountService, private zonesService: ZonesService) {
    this.profileImage = 'assets/img/profile_placeholder.png'

    this.getZones()

    this.userForm = new FormGroup({
      email: new FormControl('', []),
      password: new FormControl('', []),
      profileImage: new FormControl('', [])
    });

    this.businessForm = new FormGroup({
      fantasyName: new FormControl('', []),
      businessName: new FormControl('', []),
      rut: new FormControl('', []),
      corporationType: new FormControl('', []),
      webpage: new FormControl('', []),
      schedules: new FormControl('', [])
    })

    this.billingForm = new FormGroup({
      address: new FormControl('', []),
      locality: new FormControl('', []),
      postalCode: new FormControl('', []),
      department: new FormControl('', []),
      phone: new FormControl('', []),
      attendant: new FormControl('', []),
      attendantPhone: new FormControl('', []),
      attendantEmail: new FormControl('', [])
    })
  }

  getZones() {
    this.zonesService.getZones().subscribe(
      res => {
        this.zones = res
        console.log(this.zones)
      }
    )
  }
  
  getErrorMessage() {
    return this.userForm.controls.email.hasError('required') ? 'Debes ingresar un email' :
      this.userForm.controls.email.hasError('email') ? 'Ingresa un email válido' :
        '';
  }

  goTo2ndStep() {
    // check if provider exists before going to next step
    console.log(this.userForm.controls.email.value.trim())
    if (this.userForm.controls.email.value != this.userForm.controls.password.value) {
      this._loadingService.register('saveChangesLoading');
      this.authService.providerExists(this.userForm.controls.email.value.trim())
        .subscribe(
          res => {
            if (res.providerExists) {
              this.showDialogService.showMessageDialog('Ya existe un usuario con ese email', MessageType.success, () => {
                this._loadingService.resolve('saveChangesLoading')
              })
            } else {
              this._loadingService.resolve('saveChangesLoading')
              this.horizontalStepper ? this.horizontalStepper.next() : this.verticalStepper.next()
            }
          },
          err => this._loadingService.resolve('saveChangesLoading')
        )
    } else {
      this.showDialogService.showMessageDialog("Email y contraseña no deben coincidir", MessageType.error)
    }
  }

  signup() {
    this._loadingService.register('saveChangesLoading');
    console.log(this.userForm.controls.profileImage.value)
    if (this.billingForm.valid) { /* Need to check all or just last form? */
      this.authService.signup(this.userForm.controls.email.value.trim(), this.userForm.controls.password.value, this.businessForm.controls.fantasyName.value, this.businessForm.controls.businessName.value,
        this.businessForm.controls.rut.value, this.businessForm.controls.corporationType.value, this.businessForm.controls.webpage.value, this.billingForm.controls.address.value,
        this.billingForm.controls.locality.value, this.billingForm.controls.postalCode.value, this.billingForm.controls.department.value,
        this.billingForm.controls.attendant.value, this.billingForm.controls.attendantPhone.value, this.billingForm.controls.attendantEmail.value,
        2, this.userForm.controls.profileImage.value, '', this.billingForm.controls.phone.value, this.businessForm.controls.schedules.value)
        .subscribe(
          res => {
            console.log(res);
            this.authService.login(this.userForm.controls.email.value, this.userForm.controls.password.value)
              .subscribe(
                res => this.load(res)
              );
          }
        );
    } else {
      this.showDialogService.showMessageDialog('Debes completar todos los campos', MessageType.error, () => {
        this._loadingService.resolve('saveChangesLoading');
      });
    }
  }

  load(provider) {
    console.log(provider);
    if (provider) {
      this.cookieService.set('cookie', provider.cookie, undefined, '/rep-webapp');
      this.cookieService.set('userId', provider.user.id, undefined, '/rep-webapp');
      this.provider = provider;

      if (this.profileImage != 'assets/img/profile_placeholder.png') {
        this.s3ManagerService.uploadFile(this.profileImage, 'users/' + this.cookieService.get('userId') + '/profile.jpg', () => {
          // update pic url
          let providerUpdated = {
            picture: {
              url: 'users/' + this.cookieService.get('userId') + '/profile.jpg',
              thumbnailUrl: 'users/' + this.cookieService.get('userId') + '/profile.jpg' // TODO: create thumbnail
            }
          }
          this.accountService.editProvider(providerUpdated).subscribe(res => {
            console.log("updated provider")
          })
          this.navigateToRequests()
        })
      } else {
        this.navigateToRequests()
      }

    }
  }

  navigateToRequests() {
    this._loadingService.resolve('saveChangesLoading');
    this.router.navigate(['requests']);
  }

  openSelectProfileImageDialog() {
    const dialogRef = this.dialog.open(SelectProfileImageDialog, {
      width: '40%',
      data: { currentImage: this.profileImage, uploadToS3: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.profileImage = dialogRef.componentInstance.croppedImage ? dialogRef.componentInstance.croppedImage : this.profileImage
    });
  }
}

