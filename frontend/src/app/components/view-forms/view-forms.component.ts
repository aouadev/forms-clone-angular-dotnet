import { Component, OnInit } from "@angular/core";
import { FormService } from"../../services/form.service";
import { Form } from "src/app/models/form"  ;
import {User} from "../../models/user";
import { Observable, of } from "rxjs";
import { AuthenticationService } from "src/app/services/authentication.service";
@Component({
    selector: 'view_forms',
    templateUrl: './view-forms.component.html',
    styleUrl: './view-forms.component.css'

})
export class ViewFormsComponent {
    forms?: Form[];
    currentUser?: User;

    constructor(private formService: FormService,
                 private authenticationService : AuthenticationService) {
                    this.currentUser = this.authenticationService.currentUser;
                 }
                  
    ngOnInit() {
       if (this.authenticationService.currentUser?.roleAsString != 'guest') {
        const userId = this.authenticationService.currentUser?.id;
        if (userId) {
            this.formService.getMyForms(userId).subscribe((res) => {
                this.forms = res;
               /* this.forms.forEach((form) => {
                    console.log(form.lastInstance);
                    this.formService.getUser(form.ownerId).subscribe((user) => {
                        form.ownerName = user.firstName + " " + user.lastName;
                    })
                });*/
            });
        } else {
            console.error("not user connected");
        }
    } else {
        this.formService.getPublicForms().subscribe((res) => {
            this.forms = res;
           /* this.forms.forEach((form) => {
                this.formService.getUser(form.ownerId).subscribe((user) => {
                    form.ownerName = user.firstName + " " + user.lastName;
                })
            });*/
        });
    }
    }



}