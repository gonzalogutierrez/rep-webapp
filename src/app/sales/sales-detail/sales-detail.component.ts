// Developed by Houlak
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { S3ManagerService } from '../../s3-manager.service';
import { parseDate } from '../../common';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { TdLoadingService } from '@covalent/core';

import { RateConsumerDialog } from '../rate-consumer/rate-consumer.component';
// services
import { SaleService } from '../../sales/sales.service';
// models
import Sale, { SaleStatus, getSaleStatusString } from '../../sales/sale.model';
import { getOfferConditionString } from '../../offers/model/enum/offer_condition.enum';
import { getOfferPaymentMethodString } from '../../offers/model/enum/offer_payment_method.enum';
import { getOfferStatusString, OfferStatus } from '../../offers/model/enum/offer_status.enum';
import { getOfferTypeString, OfferType } from '../../offers/model/enum/offer_type.enum';
import { getOfferAvailableString } from '../../offers/model/enum/offer_available.enum';

@Component({
  selector: 'app-sales-detail',
  templateUrl: './sales-detail.component.html',
  styleUrls: ['./sales-detail.component.scss']
})

export class SalesDetailComponent implements OnInit {

  sale;

  @ViewChild('myCarousel') myCarousel: NgbCarousel;

  getOfferConditionString = getOfferConditionString;
  getOfferPaymentMethodString = getOfferPaymentMethodString;
  getOfferStatusString = getOfferStatusString;
  getOfferTypeString = getOfferTypeString;
  getOfferAvailableString = getOfferAvailableString;

  getSaleStatusString = getSaleStatusString;
  SaleStatus = SaleStatus;
  OfferStatus = OfferStatus;

  images: SafeResourceUrl[];
  consumerImage: SafeResourceUrl;
  activeIndex: string = '0';

  parseDate = parseDate;

  constructor(private route: ActivatedRoute, private saleService: SaleService, public dialog: MatDialog, private s3ManagerService: S3ManagerService,
              private sanitizer: DomSanitizer, private _loadingService: TdLoadingService) {
    this._loadingService.register('loading');
    let saleId = this.route.snapshot.params.id;

    saleService.getSale(saleId)
      .subscribe(
        sale => this.loadSale(sale)
      )
  }

  ngOnInit() {
  }

  loadSale(sale: Sale) {
    this._loadingService.resolve('loading');
    console.log(sale)
    this.sale = sale
    this.images = []
    for (let img of sale.request.pictureURLList) {
      console.log(img.url)
      this.s3ManagerService.downloadFile(img.url).then((url) => {
        let downloadedImage = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.images.push(downloadedImage);
        console.log(downloadedImage)
      });
    }

    this.s3ManagerService.downloadFile(sale.consumer.picture.url).then((url) => {
      let downloadedImage = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      console.log(downloadedImage)
      this.consumerImage = downloadedImage;
    });
  }

  getStatus(status: number): string {
    return OfferStatus[status]
  }

  getOfferType(type: number): string {
    return OfferType[type]
  }

  showZoomedImage(index: string) {
    this.myCarousel.select(index);
  }

  showRateConsumer() {

    const dialogRef = this.dialog.open(RateConsumerDialog, {
      data: { saleId: this.sale._id }
    });
  }
}
