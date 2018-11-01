// Developed by Houlak
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { ServerResponse } from '../messages/server-response.model';
import { CookieService } from 'ngx-cookie-service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

// models
import { Request, PaginatedRequests } from './request.model';

import { environment } from 'environments/environment';

@Injectable()
export class RequestService {

  private requestsUrls = `${environment.server}/requests`;

  constructor (private http: HttpClient, private cookieService: CookieService) {}

  getRequests(page, filters, sortValue, sortDirection): Observable<PaginatedRequests> {

    filters['active'] = true
    filters['page'] = page
    if (sortValue && sortDirection) {
      filters["sort"] = sortValue
      filters["direction"] = sortDirection
    }
    console.log(filters);
    return this.http.get(this.requestsUrls, { params: filters, observe: 'response' }).map(this.extractRequestsData)
        .catch(this.handleError);
  }

  getRequest(requestId: string): Observable<Request> {
    return this.http.get(this.requestsUrls + '/' + requestId)
          .map(this.extractData)
          .catch(this.handleError);
  }


  askQuestion(requestId: string, question: string) {
    return this.http.post(`${this.requestsUrls}/${requestId}/questions`, { body: question })
          .map(this.extractData)
          .catch(this.handleError);
  }

  private extractRequestsData(res: HttpResponse<ServerResponse>) {
    let link = res.headers.get('Link');
    let links = link.split(',')
    let total
    for (let key of links) {
      if (key.includes('total')) {
        total = parseInt(key.split(';')[0])
      }
    }
    let body = res.body;
    return { requests: body.data, total: total } || { };
  }

  private extractData(res: ServerResponse) {
    console.log(res);
    return res.data || { };
  }

  private handleError (error: HttpResponse<ServerResponse> | any) {
    return Observable.throw(error);
  }
}
