// Developed by Houlak
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { environment } from 'environments/environment';
import { Provider } from './provider.model';
import { String } from 'aws-sdk/clients/acm';
import { ServerResponse } from '../messages/server-response.model';
import { hashPwd } from '../common';

@Injectable()
export class AccountService {

  private providerUrls = `${environment.server}/providers`;
  private userUrls = `${environment.server}/users`;
  private billerUrls = `${environment.server}/biller`;

  constructor (private http: HttpClient, private cookieService: CookieService) {}

  getProvider(): Observable<Provider> {
    return this.http.get(`${this.providerUrls}/${this.cookieService.get('userId')}`)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  getProviderBills(): Observable<Provider[]> {
    return this.http.get(`${this.billerUrls}`, { params: { providerId: `${this.cookieService.get('userId')}`}})
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  getBill(billerId: String) {
    return this.http.get(`${this.billerUrls}/pdf`, { params: { billerId: billerId }})
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  editProvider(newProvider: Provider) {
    return this.http.put(`${this.providerUrls}/${this.cookieService.get('userId')}`, newProvider)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  changePwd(oldPwd: string, newPwd: string): Observable<HttpResponse<ServerResponse>> {
    let payload = {
      oldPwd: hashPwd(oldPwd),
      newPwd: hashPwd(newPwd)
    }

    return this.http.post(`${this.userUrls}/${this.cookieService.get('userId')}/change_pwd`, payload)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  private extractData(res: ServerResponse) {
    console.log(res);
    if (res.result) {
      return res.data || {};
    }
  }

  private handleError(error: HttpResponse<ServerResponse> | any) {
    return Observable.throw(error);
  }
}
