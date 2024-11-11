import { Component } from "@angular/core";
import { FormService } from"../../services/form.service";
import { Form } from "src/app/models/form"  ;
import {User} from "../../models/user";
@Component({
    selector: 'myforms',
    templateUrl: './myforms.component.html'

})
export class MyFormsComponent {
    forms?: Form[];
    formOwner?: User;

    constructor(private formService: FormService) {
        this.formService.getAll().subscribe((res) => this.forms = res);
        
    }
}