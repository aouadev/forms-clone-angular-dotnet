import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Form } from 'src/app/models/form';
import {Role, User} from "../../models/user";
import { format, formatISO} from 'date-fns';
import { from } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {DeleteFormDialog} from "../view_form/dialogs/deleteFormDialog.component";
import {OpenFormDialogComponent} from "./dialogs/open-form-dialog.component";
import {AuthenticationService} from "../../services/authentication.service";


@Component({
    selector: 'form-card',
    templateUrl: './form-card.component.html',
    styleUrl: './view-forms.component.css'
})
export class FormCardComponent {
    @Input() form!: Form;
    @Input() currentUser? : User;
    constructor(
        public confirmDialog: MatDialog,
        private router: Router,
        private authenticationService: AuthenticationService,){}

    canManage() : boolean {
        return this.currentUser?.role == Role.Admin 
        || this.currentUser?.id == this.form.owner.id;
    }

    canOpenFormConfirm(): boolean {
        return this.currentUser?.role != Role.Guest
        && !!this.form.lastInstance?.completed;
    }
    handleButtonOpen() {
        if (!this.authenticationService.GuestMode) {
            this.canOpenFormConfirm() ? this.openDialog() : this.openInstance();
        } else {
            this.router.navigate(['instance'], {state : {form: this.form, isNew: true }});
        }

    }

    openManageForm() {
        this.router.navigate(['viewForm'], {state: {data: this.form}});
    }

    openDialog(): void {
        const activeElement = document.activeElement;
        if (activeElement instanceof HTMLElement) {
        activeElement.blur();
        }
        this.confirmDialog.open(OpenFormDialogComponent, {
            data: {form: this.form},
            disableClose: true,
            autoFocus: true,
        });
    }
   /* openDialog() {
        this.confirmDialog.open(OpenFormDialogComponent, {autoFocus: true, disableClose: true}).afterClosed().subscribe(result => {
            this.router.navigate(['/instance'], { state: { form: this.form, isNew: result }});
        })
    }*/
    

 
   
    openInstance() {
        this.router.navigate(['instance'], {state: {form: this.form, isNew: false}});
    }
}