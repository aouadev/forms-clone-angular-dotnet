import { Component, OnInit } from "@angular/core";
import { FormService } from"../../services/form.service";
import { Form } from "src/app/models/form"  ;
import {User} from "../../models/user";
import { Observable, of } from "rxjs";
import { AuthenticationService } from "src/app/services/authentication.service";
@Component({
    selector: 'view_forms',
    templateUrl: './view_forms.component.html',
    styleUrl: './view_forms.component.css'

})
export class ViewFormsComponent {
    forms?: Form[];

    

    constructor(private formService: FormService,
                 private authenticationService : AuthenticationService) {}
                  
    ngOnInit() {
       const userId = this.authenticationService.currentUser?.id;
       if (userId) {
        this.formService.getMyForms(userId).subscribe((res) => {
            this.forms = res;
            this.forms.forEach((form) => {
                this.formService.getUser(form.ownerId).subscribe((user) => {
                    form.ownerName = user.firstName + " " + user.lastName;
                })
            });
        });
    } else {
        console.error("not user connected");
    }
    }


}