// Developed by Houlak
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// services
import { S3ManagerService } from '../s3-manager.service';
import { CookieService } from 'ngx-cookie-service';
import { TdLoadingService } from '@covalent/core';
import { AccountService } from '../account/account.service';

@Component({
  selector: 'profile-image-dialog',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.scss']
})

export class SelectProfileImageDialog {

  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private cookieService: CookieService, private s3ManagerService: S3ManagerService,
      private _loadingService: TdLoadingService, private accountService: AccountService) {
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(image: string) {
    this.croppedImage = image;
  }
  imageLoaded() {
    // show cropper
  }
  loadImageFailed() {
    // show message
  }

  changeProfileImage() {
    if (this.data.uploadToS3) {
      this._loadingService.register('changeProfileImageLoading');
      this.s3ManagerService.uploadFile(this.croppedImage, 'users/' + this.cookieService.get('userId') + '/profile.jpg', () => {
        this._loadingService.resolve('changeProfileImageLoading');

        let providerUpdated = {
          picture: {
            url: 'users/' + this.cookieService.get('userId') + '/profile.jpg',
            thumbnailUrl: 'users/' + this.cookieService.get('userId') + '/profile.jpg' // TODO: create thumbnail
          }
        }
        this.accountService.editProvider(providerUpdated).subscribe(res => {
          console.log("updated provider")
        })

        this.dialog.closeAll();
      })
    } else {
      this.dialog.closeAll();
    }
  }
}
