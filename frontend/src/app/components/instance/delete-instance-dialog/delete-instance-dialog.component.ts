
import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: 'delete-instance-dialog',
    templateUrl: 'delete-instance-dialog.component.html'
})
export class DeleteInstanceDialogComponent {
    constructor(private dialogRef: MatDialogRef<DeleteInstanceDialogComponent>) {}

    confirmDelete() {
        this.dialogRef.close(true);
    }

    cancel() {
        this.dialogRef.close(false);
    }
}