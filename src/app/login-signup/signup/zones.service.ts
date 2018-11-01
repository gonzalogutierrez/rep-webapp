// Developed by Houlak
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { ServerResponse } from '../../messages/server-response.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { environment } from "environments/environment";

@Injectable()
export class ZonesService {

  private zonesUrl =  `${environment.server}/users/zones`;

  constructor (private http: HttpClient, private cookieService: CookieService) {}

  getZones() {

    return this.http.get(this.zonesUrl)
        .map(this.extractData)
        .catch(this.handleError);;
  }

  private extractData(res: ServerResponse) {
    console.log(res);
    return res.data || { };
  }

  private handleError (error: Response | any) {
    return Observable.throw(error);
  }
}
