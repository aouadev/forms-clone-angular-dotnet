import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: 'delete-instance-dialog',
    templateUrl: 'delete-instance-dialog.component.html'
})
export class DeleteInstancesDialogComponent {
    constructor(private dialogRef: MatDialogRef<DeleteInstancesDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        
    }

    confirmDelete() {
        this.dialogRef.close(true);
    }

    cancel() {
        this.dialogRef.close(false);
    }
}