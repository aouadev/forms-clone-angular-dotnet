import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";


@Component({
    selector: 'delete-qestion-dialog',
    templateUrl: 'deleteQuestionDialog.component.html',
    
})
export class DeleteQuestionDialog {
    constructor(private dialogRef: MatDialogRef<DeleteQuestionDialog>,
                @Inject (MAT_DIALOG_DATA) public data: {questionTitle: string}
      
    ){}


    confirmDelete() {
        this.dialogRef.close(true);
        
    }
    cancel() {
        this.dialogRef.close(false);
    }
}