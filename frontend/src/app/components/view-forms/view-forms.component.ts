import { Component, OnInit } from "@angular/core";
import { FormService } from"../../services/form.service";
import { Form } from "src/app/models/form"  ;
import {User} from "../../models/user";
import {Role} from "../../models/user";
import { Observable, of } from "rxjs";
import { AuthenticationService } from "src/app/services/authentication.service";
import { th } from "date-fns/locale";
@Component({
    selector: 'view_forms',
    templateUrl: './view-forms.component.html',
    styleUrl: './view-forms.component.css'

})
export class ViewFormsComponent {
    forms?: Form[];
    currentUser?: User;
    filterIsVisible?: boolean = false;
    filterText: string = '';
    filtredForms?: Form[];
    formsFromBackend?: Form[];
    

    constructor(private formService: FormService,
                private authenticationService : AuthenticationService) {
                    this.currentUser = this.authenticationService.currentUser;
                }
                  
    ngOnInit() {
        if (!this.authenticationService.GuestMode) {
            const userId = this.currentUser?.id;
            if (userId) {
                console.log("role:" + this.currentUser?.role);
            if (this.currentUser?.role == Role.Admin) {
                    console.log(this.currentUser?.role);
                    this.formService.getAllForms().subscribe((res) => {
                        this.forms = res;
                        this.formsFromBackend = res;
                    });
                }else {
                    this.formService.getMyForms().subscribe((res) => {
                        this.forms = res;
                        this.formsFromBackend = res;
                    });
                }
            }
            else {
                console.error("not user connected");
            }
        } else {
            this.formService.getPublicForms().subscribe((res) => {
                this.forms = res;
                this.formsFromBackend = res;
            });
        }
    }
    askToggleFilter() {
        console.log(this.filterIsVisible);
        this.filterIsVisible = !this.filterIsVisible;
        console.log(this.filterIsVisible);

    }

    applyFilter() {
        const lowerCaseFilter = this.filterText.toLowerCase();
        this.filtredForms = this.forms?.filter((form) => 
            form.title.toLowerCase().includes(lowerCaseFilter) ||
            form.description?.toLowerCase().includes(lowerCaseFilter)||
            form.ownerFirstName?.toLowerCase().includes(lowerCaseFilter) ||
            form.ownerLastName?.toLowerCase().includes(lowerCaseFilter) ||
            form.ownerEmail?.toLowerCase().includes(lowerCaseFilter)
        );
        
        this.filterText != '' ? this.forms = this.filtredForms : this.forms = this.formsFromBackend;
    }


}