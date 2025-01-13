import { DialogRef } from "@angular/cdk/dialog";
import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: 'delete-option-dialog',
    templateUrl: 'delete-dialog.component.html'
})
export class DeleteOptionDialogComponent {
    constructor(private dialogRef:MatDialogRef<DeleteOptionDialogComponent>) {

    }

    confirmDelete() {
        this.dialogRef.close(true);
    }
    cancel() {
        this.dialogRef.close(false);
    }
}
