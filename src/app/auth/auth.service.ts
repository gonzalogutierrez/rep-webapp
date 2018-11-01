// Developed by Houlak
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { S3ManagerService } from '../s3-manager.service';

import { environment } from 'environments/environment';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ServerResponse } from '../messages/server-response.model';
import { hashPwd } from '../common';

@Injectable()
export class AuthService {

  private providerUrl = `${environment.server}/providers`;
  private userUrl = `${environment.server}/users`;

  constructor(private cookieService: CookieService, private httpClient: HttpClient, private s3ManagerService: S3ManagerService) { }

  isAuthenticated() {
    return this.cookieService.check('cookie');
  }

  login(email: string, password: string): Observable<HttpResponse<ServerResponse>> {

    this.cookieService.deleteAll('../rep-webapp');
    let loginInfo = { email: email, password: hashPwd(password) };

    return this.httpClient.post(this.providerUrl + '/login', loginInfo, {})
      .map(this.extractData)
      .catch(this.handleError);
  }

  providerExists(email: string) {
    return this.httpClient.post(this.providerUrl + '/exists', {email}, {})
      .map(this.extractData)
      .catch(this.handleError);
  }

  signup(email: string, password: string, fantasyName: string, businessName: string, rut: string,
    corporationType: string, webpage: string, address: string, locality: string, postalCode: number, department: string,
    attendant: string, attendantPhone: string, attendantEmail: string,
    providerType: number, picture: string, pictureThumbnail: string, phone: string, schedules: string):
    Observable<HttpResponse<ServerResponse>> {

    // console.log('pic: ' + picture)
    // this.s3ManagerService.uploadFile(picture, 'users/1234/profile.jpg', () => {

    // })

    console.log('signup');
    let signupInfo = {
      email, fantasyName, businessName, rut, corporationType, webpage, address, locality, postalCode, department,
      attendant, attendantPhone, attendantEmail, providerType, picture: undefined,
      pictureThumbnail, phone, schedules, password: hashPwd(password)
    };

    return this.httpClient.post(this.providerUrl + '/signup', signupInfo, {})
      .map(this.extractData)
      .catch(this.handleError);
  }

  forgotPwd(email) {
    let body = { email }

    return this.httpClient.post(this.userUrl + '/forgot-password', body)
      .map(this.extractData)
      .catch(this.handleError);
  }

  logout() {
    return this.httpClient.post(this.providerUrl + '/logout', {})
      .map(this.extractData)
      .catch(this.handleError);
  }

  restorePwd(hashedPwd, token) {
    let body = {
      token,
      password: hashedPwd
    }

    return this.httpClient.post(this.userUrl + '/restore-password', body)
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
