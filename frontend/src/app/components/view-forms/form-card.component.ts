import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Form } from 'src/app/models/form';
import { format, formatISO} from 'date-fns';
import { from } from 'rxjs';

@Component({
    selector: 'form-card',
    templateUrl: './form-card.component.html',
     styleUrl: './view-forms.component.css'
})
export class FormCardComponent {
    @Input() form!: Form;
}