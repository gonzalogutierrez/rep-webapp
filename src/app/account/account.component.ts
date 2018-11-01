// Developed by Houlak
import { Component, OnInit, Inject } from '@angular/core';

// services
import { CookieService } from 'ngx-cookie-service';
import { AccountService } from './account.service';
import { SaleService } from '../sales/sales.service';
import { AuthService } from '../auth/auth.service';
import { S3ManagerService } from '../s3-manager.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableModule, MatTableDataSource, MatSort } from '@angular/material';

import { SelectProfileImageDialog } from '../profile-image/profile-image.component';
import { TdLoadingService } from '@covalent/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  spareCount = 15;
  totalSales = 5600;
  commissions = 300;
  nativeWindow: any

  provider;
  summary;

  profileImage;

  constructor(private cookieService: CookieService, private accountService: AccountService, private authService: AuthService, private saleService: SaleService,
              private sanitizer: DomSanitizer, private s3ManagerService: S3ManagerService, public dialog: MatDialog,
              private router: Router) {

      this.profileImage = 'assets/img/profile_placeholder.png'
      this.accountService.getProvider().subscribe(
        provider => {
          this.provider = provider
          this.downloadProfileImage()
        }
      );

      this.saleService.getProviderSalesSummary().subscribe(
        summary => {
          console.log(summary);
          this.summary = summary;
        }
      );
  }

  async downloadProfileImage() {
    this.s3ManagerService.downloadFile('users/' + this.cookieService.get('userId') + '/profile.jpg').then((url) => {

      this.profileImage = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      console.log(this.profileImage);
    });
  }

  openSelectProfileImageDialog() {
    const dialogRef = this.dialog.open(SelectProfileImageDialog, {
      data: { currentImage: this.profileImage, uploadToS3: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.downloadProfileImage()
    });
  }

  ngOnInit() {
  }

  showProviderBills() {
    this.accountService.getProviderBills().subscribe(
      bills => {
        const dialogRef = this.dialog.open(ShowBillsDialog, {
          data: { bills: bills }
        });
      }
    )
  }
  logout() {
    this.authService.logout().subscribe(
      res => {
        this.cookieService.deleteAll('/rep-webapp');
        localStorage.removeItem('requestFilters')
        localStorage.removeItem('saleFilters')
        localStorage.removeItem('paymentMethods')
        this.router.navigate(['login']);
      }
    )
  }
}

@Component({
  selector: 'show-bills-dialog',
  templateUrl: './show-bills-dialog.html'
})

export class ShowBillsDialog {

  bills = []
  displayedColumns = ['code', 'expirationDate', 'totalAmount', 'details'];
  nativeWindow: any

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private accountService: AccountService,
              private _loadingService: TdLoadingService) {
    this.bills = data.bills
    console.log(this.bills);
  }

  showReceipt(billerId: string) {
    this.accountService.getBill(billerId).subscribe(
      receipt => {

        this.dialog.open(ShowBillDialog, {
          width: '90vw',
          height: '95vh',
          data: {receipt}
        })
      }
    )
  }
}


@Component({
  selector: 'show-bill-dialog',
  templateUrl: './show-bill-dialog.html'
})

export class ShowBillDialog {
  iframeSrc: SafeUrl;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private sanitizer: DomSanitizer) {
    this.iframeSrc = sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64, ' + data.receipt);
    console.log(this.iframeSrc)
  }
}
