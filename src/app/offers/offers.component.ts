// Developed by Houlak
import { Component, OnInit } from '@angular/core';
import { TdLoadingService } from '@covalent/core';
import { Router } from '@angular/router';
// services
import { OfferService } from '../offers/offer.service';
// models
import { Offer, PaginatedOffers } from '../offers/model/offer.model';



@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {

  offers: Offer[] = [];

  constructor(private offerService: OfferService, private _loadingService: TdLoadingService,
              private router: Router) {
    this._loadingService.register('loadingOffers');
    offerService.getOffers(1)
                .subscribe(
                   offers => this.loadOffers(offers)
                 );
  }

  loadOffers(response: PaginatedOffers) {
    this.offers = response.offers;
    this._loadingService.resolve('loadingOffers');
  }

  showOfferDetail(offerId: string) {
    this.router.navigate(['offers/' + offerId]);
  }

  ngOnInit() {
  }

}
