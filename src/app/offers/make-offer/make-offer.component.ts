// Developed by Houlak
import { Component, Inject } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { OfferType, getOfferTypeString } from "../model/enum/offer_type.enum";
import { Offer } from "../model/offer.model";
import { getOfferConditionString, OfferCondition } from "../model/enum/offer_condition.enum";
import { OfferPaymentMethod, getOfferPaymentMethodString } from "../model/enum/offer_payment_method.enum";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { OfferSummaryDialog } from "../summary/offer-summary.component";
import { ShowDialogService } from "../../messages/show-dialog.service";
import { MessageType } from "../../messages/message-type.enum";
import { getOfferAvailableString, OfferAvailable } from "../model/enum/offer_available.enum";

@Component({
    selector: 'make-offer',
    templateUrl: './make-offer.component.html',
    styleUrls: ['./make-offer.component.scss']
})

export class MakeOfferDialog {

    makeOfferForm: FormGroup;

    requestId: string;
    price: number;
    brand: string;
    coo: string;
    condition: number;
    state: number;
    type: number;
    devolution: boolean;
    availableNow: number;
    delivery: boolean;
    paymentMethods = [];
    formColor = 'warn';

    offerTypes = OfferType;
    getOfferTypeString = getOfferTypeString;
    offerConditions = OfferCondition;
    getOfferConditionString = getOfferConditionString;
    offerPaymentMethods = OfferPaymentMethod;
    getOfferPaymentMethodString = getOfferPaymentMethodString;
    offerAvailable = OfferAvailable;
    getOfferAvailableString = getOfferAvailableString;

    offerTypeKeys = Object.keys(this.offerTypes).filter(Number);
    offerConditionKeys = Object.keys(this.offerConditions).filter(Number);
    offerPaymentMethodKeys = Object.keys(this.offerPaymentMethods).filter(Number);
    offerAvailableKeys = Object.keys(this.offerAvailable).filter(Number);

    readonly PAYMENT_METHODS_KEY = "paymentMethods"

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private showDialogService: ShowDialogService) {
        this.requestId = data.requestId;

        console.log(this.paymentMethods)

        this.makeOfferForm = new FormGroup({
            price: new FormControl('', []),
            brand: new FormControl('', []),
            coo: new FormControl('', []),
            condition: new FormControl('', []),
            state: new FormControl('', []),
            type: new FormControl('', []),
            devolution: new FormControl('', []),
            availableNow: new FormControl('', []),
            delivery: new FormControl('', [])
        });
        this.paymentMethods = this.getPaymentMethodsFromLocalStorage()
        console.log(this.paymentMethods)
    }

    getPaymentMethodsFromLocalStorage() {
        if (localStorage && localStorage.getItem(this.PAYMENT_METHODS_KEY)) {
          return JSON.parse(localStorage.getItem(this.PAYMENT_METHODS_KEY))
        }
        return []
      }

      addPaymentMethodsToLocalStorage() {
        if (localStorage) {
          localStorage.setItem(this.PAYMENT_METHODS_KEY, JSON.stringify(this.paymentMethods))
        }
      }

    openOfferSummaryDialog() {
        if (this.makeOfferForm.valid) {
            if (this.paymentMethods && this.paymentMethods.length > 0) {
                this.addPaymentMethodsToLocalStorage()
                console.log(this.paymentMethods)
                let offer = new Offer(this.requestId, this.makeOfferForm.controls.price.value, this.makeOfferForm.controls.brand.value, this.makeOfferForm.controls.coo.value,
                    this.makeOfferForm.controls.condition.value, this.makeOfferForm.controls.type.value, this.makeOfferForm.controls.devolution.value, this.makeOfferForm.controls.availableNow.value,
                    this.paymentMethods, this.makeOfferForm.controls.delivery.value, []);

                    console.log(offer)
                const dialogRef = this.dialog.open(OfferSummaryDialog, {
                    width: window.innerWidth > 960 ? '40%' : '90%',
                    data: { offer: offer }
                });

                dialogRef.afterClosed().subscribe(result => {
                    console.log(`Dialog result: ${result}`);
                });
            } else {
                this.showDialogService.showMessageDialog("Debes seleccionar al menos un método de pago", MessageType.error, () => {})
            }
        } else {
            this.showDialogService.showMessageDialog("Debes completar todos los campos obligatorios", MessageType.error, () => {})
        }
    }

    togglePaymentMethodSelection(key) {
        console.log(key)
        console.log("BEFORE TOGGLE")
        console.log(this.paymentMethods)
        var idx = this.paymentMethods.indexOf(getOfferPaymentMethodString(key));
        console.log("INDEX")
        console.log(idx)
        if (idx > -1) {
          this.paymentMethods.splice(idx, 1);
        } else {
          this.paymentMethods.push(getOfferPaymentMethodString(key));
        }
        console.log("AFTER TOGGLE")
        console.log(this.paymentMethods)
    }

    paymentMethodIsChecked(key) {
        console.log("IS CHECKED? " + key)
        let checked = false
        if (this.paymentMethods && this.paymentMethods.find(paymentMethod => paymentMethod === getOfferPaymentMethodString(key))) {
            checked = true
        }
        console.log(checked)
        return checked
    }
}
