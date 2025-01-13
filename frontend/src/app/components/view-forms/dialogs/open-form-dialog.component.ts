

import {Component, Inject} from '@angular/core';
import { template } from 'lodash-es';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { from } from 'rxjs';
import { Form } from 'src/app/models/form';
import { Router } from '@angular/router';
@Component({
    selector: 'open-form-confirm',
    templateUrl: 'open-form-dialog.component.html'
})

export class OpenFormDialogComponent {
    constructor(
        private router: Router,
        private dialogRef: MatDialogRef<OpenFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {form: Form}) {}


    openInstance(isNew: boolean) {
        this.router.navigate(['/instance'], { state: { form: this.data.form, isNew: isNew}});
        this.dialogRef.close();

    }
    

    read() {
        this.dialogRef.close(false);
    }

    respond() {
        this.dialogRef.close(true);
    }
    cancel() {
        this.dialogRef.close();
    }

}