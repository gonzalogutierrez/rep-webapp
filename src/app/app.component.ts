// Developed by Houlak
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material';

import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {

  title = 'app';
  selectedNavIndex = 0;

  constructor(public authService: AuthService, router: Router) {
    // if (!authService.isAuthenticated()) {
    //   router.navigate(['login']);
    // }

  }

  changeSelected(index) {
    this.selectedNavIndex = index
  }


}
