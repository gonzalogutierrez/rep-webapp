// Developed by Houlak
import { Component, Inject } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { RequestService } from "../../requests/request.service";
import { ShowDialogService } from "../../messages/show-dialog.service";
import { TdLoadingService } from "@covalent/core";
import { MessageType } from "../../messages/message-type.enum";

@Component({
    selector: 'ask-question',
    templateUrl: './ask-question.component.html',
    styleUrls: ['./ask-question.component.scss']
  })
  
  export class AskQuestionDialog {
  
    askQuestionForm: FormGroup;
  
    requestId: string;
    formColor = 'warn';
    questions = [
      'Falta descripcion/datos/medida',
      'Falta VIN',
      'Falta OEM',
      'Faltan fotos',
      'Falta marca/modelo/versión',
    ]
  
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private requestService: RequestService,
                        private showDialogService: ShowDialogService, private _loadingService: TdLoadingService) {
      this.requestId = data.requestId;
  
      this.askQuestionForm = new FormGroup({
        question: new FormControl('', [])
      });
    }
  
    askQuestion() {
      this._loadingService.register('loadingQuestions');
      this.requestService.askQuestion(this.requestId, this.askQuestionForm.controls.question.value)
          .subscribe(questionResponse => {
            this.dialog.closeAll();
  
            this.showDialogService.showMessageDialog('Pregunta enviada con éxito', MessageType.success,() => {});
          })
    }
  }
