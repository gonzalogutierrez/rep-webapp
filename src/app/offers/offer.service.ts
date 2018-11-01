// Developed by Houlak
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { ServerResponse } from '../messages/server-response.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { environment } from "environments/environment";
import { Offer, PaginatedOffers } from './model/offer.model';

@Injectable()
export class OfferService {

  private offerUrls =  `${environment.server}/offers`;

  constructor (private http: HttpClient, private cookieService: CookieService) {}

  addOffer(offer: Offer) {

    let offerInfo = { price: offer.price, brand: offer.brand, coo: offer.coo, condition: offer.condition, type: offer.type, devolution: offer.devolution, availableNow: offer.availableNow,
      paymentMethods: offer.paymentMethods, delivery: offer.delivery, status: offer.status, requestId: offer.request._id }

    console.log(offerInfo);
    return this.http.post(this.offerUrls, offerInfo);
  }


  getOffers(page): Observable<PaginatedOffers> {
    let params = {}
    params["page"] = page
    params['sort'] = 'createdAt'
    params['direction'] = 'desc'
    
    return this.http.get(`${this.offerUrls}?providerId=${this.cookieService.get('userId')}`, {params: params, observe: 'response'})
                    .map(this.extractOffersData)
                    .catch(this.handleError);
  }

  getOffersIdFromRequest(requestId: string) {

    return this.http.get(`${this.offerUrls}?requestId=${requestId}`)
                    .map(this.extractData)
                    .catch(this.handleError);
  }  

  getOffer(offerId: string): Observable<Offer> {
    return this.http.get(`${this.offerUrls}/${offerId}`)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  private extractOffersData(res: HttpResponse<ServerResponse>) {
    let link = res.headers.get('Link');
    let links = link.split(",")
    let total
    for (let key of links) {
      if (key.includes("total")) {
        total = parseInt(key.split(";")[0])
      }
    }
    let body = res.body;
    return { offers: body.data, total: total } || { };
  }

  private extractData(res: ServerResponse) {
    return res.data || { };
  }


  private handleError (error: Response | any) {
    return Observable.throw(error);
  }
}
