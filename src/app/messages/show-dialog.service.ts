// Developed by Houlak
import { Injectable, Injector, Inject, Component } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { MessageType } from './message-type.enum';

@Injectable()
export class ShowDialogService {

  constructor(public dialog: MatDialog) { }

  showMessageDialog(showMessage: string, messageType: MessageType, afterClosedCallback?) {
    const dialogRef = this.dialog.open(MessageDialog, {
      data: { 
        text: showMessage,
        messageType: messageType
       }
    });

    if (afterClosedCallback) {
      dialogRef.afterClosed().subscribe(result => {
        afterClosedCallback()
      });
    }
  }
}

@Component({
  selector: 'message-dialog',
  templateUrl: './message-dialog.html',
  styleUrls: ['./message-dialog.scss'],
})

export class MessageDialog {

  MessageType = MessageType;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }
}
