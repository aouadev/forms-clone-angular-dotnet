import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Form } from 'src/app/models/form';
import {Role, User} from "../../models/user";
import { format, formatISO} from 'date-fns';
import { from } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { OpenFormConfirmComponent } from 'src/app/components/openFormConfirm/openFormConfirm.component';

@Component({
    selector: 'form-card',
    templateUrl: './form-card.component.html',
    styleUrl: './view-forms.component.css'
})
export class FormCardComponent {
    @Input() form!: Form;
    @Input() currentUser? : User;
    constructor(
        public confirmDialog: MatDialog) {

        }

    canManage() : boolean {
        return this.currentUser?.role == Role.Admin 
        || this.currentUser?.id == this.form.owner.id;
    }

    canOpenFormConfirm(): boolean {
        return this.currentUser?.role != Role.Guest
        && !!this.form.lastInstance?.completed;
    }
    handleButtonOpen() {
        this.canOpenFormConfirm() ? this.openDialog() : console.log("action annulé");

    }

    openDialog(): void {
        const activeElement = document.activeElement;
        if (activeElement instanceof HTMLElement) {
        activeElement.blur();
        }
        this.confirmDialog.open(OpenFormConfirmComponent, {
            data: {form: this.form},
            disableClose: true,
            autoFocus: true,
        });
    }
}