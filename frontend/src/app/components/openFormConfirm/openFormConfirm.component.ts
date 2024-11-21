import {Component, Inject} from '@angular/core';
import { template } from 'lodash-es';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { from } from 'rxjs';
import { Form } from 'src/app/models/form';
@Component({
    selector: 'open-form-confirm',
    templateUrl: 'openFormConfirm.component.html'
})

export class OpenFormConfirmComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: {form: Form}) {}
}
