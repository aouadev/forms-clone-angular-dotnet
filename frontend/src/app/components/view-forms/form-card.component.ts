import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Form } from 'src/app/models/form';
import {Role, User} from "../../models/user";
import { format, formatISO} from 'date-fns';
import { from } from 'rxjs';

@Component({
    selector: 'form-card',
    templateUrl: './form-card.component.html',
     styleUrl: './view-forms.component.css'
})
export class FormCardComponent {
    @Input() form!: Form;
    @Input() currentUser? : User;

    canManage() : boolean {
        return this.currentUser?.role == Role.Admin 
        || this.currentUser?.id == this.form.ownerId;
    }
}