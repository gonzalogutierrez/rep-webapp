// Developed by Houlak
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterStateSnapshot, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { TdLoadingService } from '@covalent/core';

// services
import { OfferService } from '../offer.service';
import { S3ManagerService } from '../../s3-manager.service';
// models
import { Offer } from '../model/offer.model';
import { OfferStatus, getOfferStatusString } from '../model/enum/offer_status.enum';
import { getOfferConditionString } from '../model/enum/offer_condition.enum';
import { getOfferPaymentMethodString } from '../model/enum/offer_payment_method.enum';
import { getOfferTypeString, OfferType } from '../model/enum/offer_type.enum';
import { getOfferAvailableString } from '../model/enum/offer_available.enum';


@Component({
  selector: 'app-offers-detail',
  templateUrl: './offers-detail.component.html',
  styleUrls: ['./offers-detail.component.scss']
})
export class OffersDetailComponent implements OnInit {
  offer: Offer;

  images: SafeResourceUrl[];
  activeIndex: string = "0";

  @ViewChild('myCarousel') myCarousel: NgbCarousel;

  getOfferConditionString = getOfferConditionString;
  getOfferPaymentMethodString = getOfferPaymentMethodString;
  getOfferStatusString = getOfferStatusString;
  getOfferTypeString = getOfferTypeString;
  getOfferAvailableString = getOfferAvailableString;

  OfferStatus = OfferStatus;

  constructor(private route: ActivatedRoute, private offerService: OfferService, private s3ManagerService: S3ManagerService,
              private sanitizer: DomSanitizer, private _loadingService: TdLoadingService) {
    this._loadingService.register('loading');
    let offerId = this.route.snapshot.params.id;

    offerService.getOffer(offerId)
      .subscribe(
        offer => this.loadOffer(offer)
      )
  }

  loadOffer(offer: Offer) {
    this._loadingService.resolve('loading');
    console.log(offer)
    this.offer = offer
    this.images = []
    for (let img of offer.request.pictureURLList) {
      console.log(img.url)
      this.s3ManagerService.downloadFile(img.url).then((url) => {
        let downloadedImage = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.images.push(downloadedImage);
        console.log(downloadedImage)
      });
    }
  }

  showZoomedImage(index: string) {
    this.myCarousel.select(index);
  }

  ngOnInit() {
  }

  getStatus(status: number): string {
    return OfferStatus[status]
  }

  getOfferType(type: number): string {
    return OfferType[type]
  }
}
