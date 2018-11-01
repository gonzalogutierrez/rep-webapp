// Developed by Houlak
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
// services
import { SaleService } from '../../sales/sales.service';
import { ShowDialogService } from '../../messages/show-dialog.service';
// models
import { MessageType } from '../../messages/message-type.enum';


@Component({
  selector: 'rate-consumer',
  templateUrl: './rate-consumer.component.html',
  styleUrls: ['../sales-detail/sales-detail.component.scss']
})

export class RateConsumerDialog {

  currentRate;
  saleId;
  comment;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private router: Router,
      private saleService: SaleService, private showDialogService: ShowDialogService) {

    this.saleId = data.saleId
  }

  finishSale() {
    this.saleService.finishSale(this.saleId, this.currentRate, this.comment)
      .subscribe(
        res => this.onSaleFinished()
      );
  }

  onSaleFinished() {
    this.dialog.closeAll();
    this.showDialogService.showMessageDialog("La venta ha sido finalizada", MessageType.success, null);
    this.router.navigate(['sales']);
  }
}
