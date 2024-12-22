
import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: 'delete-form-dialog',
    templateUrl: 'deleteFormDialog.component.html'
})
export class DeleteFormDialog {
    constructor(private dialogRef: MatDialogRef<DeleteFormDialog>) {}

    confirmDelete() {
        this.dialogRef.close(true);
    }

    cancel() {
        this.dialogRef.close(false);
    }
}