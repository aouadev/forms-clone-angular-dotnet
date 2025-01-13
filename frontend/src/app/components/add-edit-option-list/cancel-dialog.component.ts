import {Component, EventEmitter, Inject, Output} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: "cancel-dialog",
    templateUrl: "cancel-dialog.component.html",
})
export class CancelDialogComponent {
    constructor(private dialogRef: MatDialogRef<CancelDialogComponent>) { }
    
    confirmCancel() {
        this.dialogRef.close(true);
    }
    saveChanges() {
        this.dialogRef.close(false);
    }
}