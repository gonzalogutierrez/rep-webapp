// Developed by Houlak
import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialog } from '@angular/material';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { TdLoadingService } from '@covalent/core';
import { MakeOfferDialog } from '../../offers/make-offer/make-offer.component';
import { AskQuestionDialog } from '../../offers/ask-question/ask-question.component';
// services
import { RequestService } from '../request.service';
import { OfferService } from '../../offers/offer.service';
import { S3ManagerService } from '../../s3-manager.service';
// models
import { Request } from '../request.model';
// router
import { ActivatedRoute } from '@angular/router';

import { parseDate } from '../../common';


@Component({
  selector: 'app-requests-detail',
  templateUrl: './requests-detail.component.html',
  styleUrls: ['./requests-detail.component.scss']
})
export class RequestsDetailComponent implements OnInit {

  @ViewChild('myCarousel') myCarousel: NgbCarousel;

  request: Request;
  requestId: string;

  images: SafeResourceUrl[];
  activeIndex = '0';

  offerIds;

  parseDate = parseDate;

  constructor(private route: ActivatedRoute, private requestService: RequestService, public dialog: MatDialog,
              private s3ManagerService: S3ManagerService, private sanitizer: DomSanitizer, private offerService: OfferService,
              private _loadingService: TdLoadingService) {
    this._loadingService.register('loading');
    this.requestId = this.route.snapshot.params.id;
    console.log(this.requestId);
    requestService.getRequest(this.requestId)
      .subscribe(
        request => this.load(request)
      )

    offerService.getOffersIdFromRequest(this.requestId)
      .subscribe(
        offerIds => this.loadOfferIds(offerIds)
      )
  }

  ngOnInit() {
  }

  load(request: Request) {
    this._loadingService.resolve('loading');
    this.request = request;
    this.images = []
    for (let img of request.pictureURLList) {
      console.log(img.url)
      this.s3ManagerService.downloadFile(img.url).then((url) => {
        let downloadedImage = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.images.push(downloadedImage);
        console.log(downloadedImage)
      });
    }
  }

  loadOfferIds(offerIds) {
    this.offerIds = offerIds
  }

  showZoomedImage(index: string) {
    this.myCarousel.select(index);
  }

  openOfferDialog() {
    const dialogRef = this.dialog.open(MakeOfferDialog, {
      width: window.innerWidth > 960 ? '50%' : '90%',
      data: { requestId: this.requestId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openQuestionDialog() {
    const dialogRef = this.dialog.open(AskQuestionDialog, {
      data: { requestId: this.requestId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
