// Developed by Houlak
import { Component, Inject } from "@angular/core";
import { getOfferConditionString, OfferCondition } from "../model/enum/offer_condition.enum";
import { OfferPaymentMethod, getOfferPaymentMethodString } from "../model/enum/offer_payment_method.enum";
import { OfferService } from "../offer.service";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { ShowDialogService } from "../../messages/show-dialog.service";
import { Router } from "@angular/router";
import { MessageType } from "../../messages/message-type.enum";
import { OfferType, getOfferTypeString } from "../model/enum/offer_type.enum";
import { OfferAvailable, getOfferAvailableString } from "../model/enum/offer_available.enum";

@Component({
    selector: 'offer-summary',
    templateUrl: './offer-summary.component.html',
    styleUrls: ['./offer-summary.component.scss']
  })

  export class OfferSummaryDialog {

    offer;
    OfferType = OfferType;
    getOfferTypeString = getOfferTypeString;
    OfferCondition = OfferCondition;
    getOfferConditionString = getOfferConditionString;
    OfferPaymentMethod = OfferPaymentMethod;
    getOfferPaymentMethodString = getOfferPaymentMethodString;
    OfferAvailable = OfferAvailable;
    getOfferAvailableString = getOfferAvailableString;

    constructor(private offerService: OfferService, @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
        private showDialogService: ShowDialogService, private router: Router) {
      this.offer = data.offer;
    }

    addOffer() {
      this.offerService
        .addOffer(this.offer)
          .subscribe( res => this.handleAddOfferResponse(res));
    }

    handleAddOfferResponse(res) {
      if (res.result) {
        this.dialog.closeAll();

        this.showDialogService.showMessageDialog('Cotización enviada con éxito', MessageType.success,() => {
          window.location.reload();
        });
      }
    }
  }
