import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";


@Component({
    selector: 'warning-dialog',
    templateUrl: 'warningDialog.component.html',
    
})
export class WarningDialog {
    constructor(private dialogRef: MatDialogRef<WarningDialog>){}

}