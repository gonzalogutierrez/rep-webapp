// Developed by Houlak
import { Injectable, Injector, Inject, Component } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ServerResponse } from './server-response.model';
import { ShowDialogService } from './show-dialog.service';
import { CookieService } from 'ngx-cookie-service';

import { MessageType } from '../messages/message-type.enum';
import { Router } from '@angular/router';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {

  readonly UNAUTHORIZED_ERROR_CODE = 104
  readonly BLOCKED_USER_ERROR_CODE = 113

  constructor(private injector: Injector, public dialog: MatDialog, private cookieService: CookieService, private showDialogService: ShowDialogService, private router: Router) { }

  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let token = this.cookieService.get('cookie');
    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token)
    })
    return next.handle(authReq)
      .do((ev: HttpEvent<any>) => {
        if (ev instanceof HttpResponse) {
          if (!ev.body.result) {
            let message = ev.body.showMessage ? ev.body.showMessage : "Ha ocurrido un error"
            this.showDialogService.showMessageDialog(ev.body.showMessage, MessageType.error, () => {});
          }
        }
      })
      .catch((response: HttpErrorResponse) => {
        let message = response.error.showMessage ? response.error.showMessage : "Ha ocurrido un error"
        this.showDialogService.showMessageDialog(message, MessageType.error, () => {
          if (response.error.errorCode == this.BLOCKED_USER_ERROR_CODE || response.error.errorCode == this.UNAUTHORIZED_ERROR_CODE) {
            this.cookieService.deleteAll('/rep-webapp');
            this.router.navigate(['login']);
          }
        });


        return Observable.throw(response);
      });
  }
}
