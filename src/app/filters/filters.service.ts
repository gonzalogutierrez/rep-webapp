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
import { PaginatedBrands } from './brand.model';
import { PaginatedModels } from './model.model';
import { PaginatedSubmodels } from './submodel.model';

import { environment } from 'environments/environment';

@Injectable()
export class FilterService {

  private brandsUrls = `${environment.server}/brands`;
  private modelsUrls = `${environment.server}/models`;
  private submodelsUrls = `${environment.server}/submodels`;
  private categoriesUrls = `${environment.server}/categories`;

  constructor (private http: HttpClient, private cookieService: CookieService) {}

  getBrands(page): Observable<PaginatedBrands> {

    let params = {}
    params["page"] = page
    params["sort"] = "name"
    params["direction"] = "asc"
    return this.http.get(this.brandsUrls, { params: params, observe: 'response' }).map(this.extractFilterData)
        .catch(this.handleError);
  }

  getModels(page, brandId: string): Observable<PaginatedModels> {

    let params = {}
    params["page"] = page
    params["brandId"] = brandId
    params["sort"] = "name"
    params["direction"] = "asc"

    return this.http.get(this.modelsUrls, { params: params, observe: 'response' }).map(this.extractFilterData)
        .catch(this.handleError);
  }

  getSubmodels(page, modelId: string): Observable<PaginatedSubmodels> {

    let params = {}
    params["page"] = page
    params["modelId"] = modelId
    params["sort"] = "name"
    params["direction"] = "asc"

    return this.http.get(this.submodelsUrls, { params: params, observe: 'response' }).map(this.extractFilterData)
        .catch(this.handleError);
  }

  getCategories(page) {
    let params = {}
    params["page"] = page
    params["sort"] = "name"
    params["direction"] = "asc"
    
    return this.http.get(this.categoriesUrls, { params: params, observe: 'response' }).map(this.extractFilterData)
        .catch(this.handleError);
  }

  private extractFilterData(res: HttpResponse<ServerResponse>) {
    let link = res.headers.get('Link');

    let links = link.split(",")
    let total
    for (let key of links) {
      if (key.includes("total")) {
        total = parseInt(key.split(";")[0])
      }
    }
    let body = res.body;
    return { data: body.data, total: total } || { };
  }

  private handleError (error: HttpResponse<ServerResponse> | any) {
    return Observable.throw(error);
  }
}
