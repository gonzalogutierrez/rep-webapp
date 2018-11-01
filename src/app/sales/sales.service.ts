// Developed by Houlak
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { ServerResponse } from '../messages/server-response.model';

import { Observable } from 'rxjs/Observable';
import { CookieService } from 'ngx-cookie-service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

// models
import Sale, { PaginatedSales } from './sale.model';

import { environment } from 'environments/environment';

@Injectable()
export class SaleService {
  private salesUrls = `${environment.server}/sales`;

  constructor (private http: HttpClient, private cookieService: CookieService) {}

  getSales(page: number, finished: boolean): Observable<PaginatedSales> {
    let params = {}

    params['page'] = page
    if (finished) {
      params['finished'] = true;
    }
    params['sort'] = 'createdAt'
    params['direction'] = 'desc'
    params['userId'] = this.cookieService.get('userId')
    return this.http.get(`${this.salesUrls}`, {params: params, observe: 'response'})
                    .map(this.extractSalesData)
                    .catch(this.handleError);
  }

  getSale(saleId: string): Observable<Sale> {
    return this.http.get(this.salesUrls + '/' + saleId)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  private extractSalesData(res: HttpResponse<ServerResponse>) {
    let link = res.headers.get('Link');
    let links = link.split(',')
    let total
    for (let key of links) {
      if (key.includes('total')) {
        total = parseInt(key.split(';')[0])
      }
    }
    let body = res.body;
    return { sales: body.data, total: total } || { };
  }

  private extractData(res: ServerResponse) {
    return res.data || { };
  }
  private handleError (error: HttpResponse<ServerResponse> | any) {
    return Observable.throw(error);
  }

  getProviderSalesSummary() {
    return this.http.get(`${this.salesUrls}/summary?userId=${this.cookieService.get('userId')}`)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  finishSale(saleId: string, rating: number, comment: string) {
    let body = {
      rating,
      comment
    }
    return this.http.post(`${this.salesUrls}/${saleId}/finish`, body)
      .catch(this.handleError);
  }
}
