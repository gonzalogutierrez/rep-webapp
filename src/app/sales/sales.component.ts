// Developed by Houlak
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTabChangeEvent } from '@angular/material';
import { TdLoadingService } from '@covalent/core';
import { Router, NavigationEnd } from '@angular/router';
import { IPageChangeEvent } from '@covalent/core';
import { parseDate } from '../common';
// services
import { SaleService } from './sales.service';
import { OfferService } from '../offers/offer.service';
// models
import Sale, { PaginatedSales, SaleStatus, SaleType, getSaleTypeString } from './sale.model';
import { Offer, PaginatedOffers } from '../offers/model/offer.model';
import { IFilter } from '../filters/filter.model';
import { PAGE_SIZE } from '../common';
import { RateConsumerDialog } from '../sales/rate-consumer/rate-consumer.component';


@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SalesComponent implements OnInit {

  sales: Sale[] = [];
  offers: Offer[] = [];

  fromRow = 1;
  currentPage = 1;
  pageSize = PAGE_SIZE;

  total: number = 1;

  showFilters = false;

  selectedSaleType = SaleType.offer
  offerSaleType = SaleType.offer
  getSaleTypeString = getSaleTypeString

  parseDate = parseDate;

  SaleStatus = SaleStatus;

  navigationSubscription;

  readonly SALE_FILTERS_KEY = "saleFilters"

  constructor(private saleService: SaleService, private offerService: OfferService, private _loadingService: TdLoadingService,
              private router: Router, public dialog: MatDialog) {
    
    this.selectedSaleType = this.getSelectedSaleTypeFromLocalStorage()

    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd && e.url.includes('sales')) {
        this.onSaleTypeSelected(this.selectedSaleType)
      }
    })
  }

  getSelectedSaleTypeFromLocalStorage() {
    console.log(localStorage)
    console.log(localStorage.getItem(this.SALE_FILTERS_KEY))
    if (localStorage && localStorage.getItem(this.SALE_FILTERS_KEY)) {
      let saleType = parseInt(localStorage.getItem(this.SALE_FILTERS_KEY))
      console.log(saleType)
      return saleType
    }
    return SaleType.offer
  }

  addSelectedSaleTypeToLocalStorage() {
    if (localStorage) {
      localStorage.setItem(this.SALE_FILTERS_KEY, this.selectedSaleType.toString())
      console.log(localStorage)
      console.log(localStorage.getItem(this.SALE_FILTERS_KEY))
      console.log(this.selectedSaleType.toString())
    } 
  }

  getSales(finished: boolean) {

    this._loadingService.register('loadingSales');
    this.saleService.getSales(this.currentPage, finished)
               .subscribe(
                  response => this.loadSales(response, finished)
                );
  }

  loadSales(response: PaginatedSales, finished: boolean) {
    console.log(response);
    this._loadingService.resolve('loadingSales');

    this.sales = response.sales
    this.total = response.total
  }

  getOffers() {
    this._loadingService.register('loadingSales');
    this.offerService.getOffers(this.currentPage).subscribe(
      response => {
        this.loadOffers(response)
      }
    )
  }

  loadOffers(response: PaginatedOffers) {
    this._loadingService.resolve('loadingSales');
    console.log(response)
    this.offers = response.offers
    this.total = response.total
  }

  page(pagingEvent: IPageChangeEvent): void {
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this.selectedSaleType == SaleType.offer ? this.getOffers() : this.getSales(this.selectedSaleType == SaleType.finished)
  }

  showOfferDetail(offerId: string) {
    this.router.navigate(['offers/' + offerId]);
  }

  showSaleDetail(saleId: string) {
    this.router.navigate([(this.selectedSaleType == SaleType.offer ? 'offers/' : 'sales/') + saleId]);
  }

  onSaleTypeSelected(saleType) {
    this.selectedSaleType = saleType
    console.log(this.selectedSaleType);
    this.currentPage = 1
    this.selectedSaleType == SaleType.offer ? this.getOffers() : this.getSales(this.selectedSaleType == SaleType.finished)
    this.addSelectedSaleTypeToLocalStorage()
  }

  removeFilter() {
    this.selectedSaleType = undefined
    this.currentPage = 1;
    this.getSales(true);
    this.getSales(false);
    this.getOffers();
  }

  toggleShowFilters() {
    this.showFilters = !this.showFilters
  }

  showRateConsumer(saleId) {
    const dialogRef = this.dialog.open(RateConsumerDialog, {
      data: { saleId: saleId }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.selectedSaleType = SaleType.finished
      this.getSales(true)
    });
  }

  ngOnInit() {
  }

}


