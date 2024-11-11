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
    formOwner?: string;

    constructor(private formService: FormService) {
        this.formService.getAll().subscribe((res) => {
            this.forms = res;

        });
        this.formService.getUser(1).subscribe((res) => this.formOwner = res.fullName);
        console.log(this.formOwner);
        

    }
}