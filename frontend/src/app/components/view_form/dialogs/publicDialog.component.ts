import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: 'public-private-dialog',
    templateUrl: 'publicDialog.component.html',

})
export class PublicDialog {
    constructor(private dialogRef: MatDialogRef<PublicDialog>,
                @Inject (MAT_DIALOG_DATA) public data: {isPublic: boolean}){}

    
    comfirmToggle() {
        this.dialogRef.close(true);
    }

    cancel() {
        this.dialogRef.close(false);
    }
}