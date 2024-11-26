import {Component, Inject} from '@angular/core';
import { template } from 'lodash-es';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { from } from 'rxjs';
import { Form } from 'src/app/models/form';
import { Router } from '@angular/router';
@Component({
    selector: 'open-form-confirm',
    templateUrl: 'openFormConfirm.component.html'
})

export class OpenFormConfirmComponent {
    constructor(
        private router: Router,
        private dialogRef: MatDialogRef<OpenFormConfirmComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {form: Form}) {}


    readInstance() {

        this.router.navigate(['/instance'], { state: { form: this.data.form}});
        this.dialogRef.close();
        
    }

}
