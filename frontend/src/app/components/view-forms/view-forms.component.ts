import { Component, OnInit } from "@angular/core";
import { FormService } from"../../services/form.service";
import { Form } from "src/app/models/form"  ;
import {User} from "../../models/user";
import {Role} from "../../models/user";
import { Observable, of } from "rxjs";
import { AuthenticationService } from "src/app/services/authentication.service";
import { th } from "date-fns/locale";
import { Router } from "@angular/router";
import {DataService} from "../../services/data.service";
@Component({
    selector: 'view_forms',
    templateUrl: './view-forms.component.html',
    styleUrl: './view-forms.component.css'

})
export class ViewFormsComponent implements OnInit{
    forms?: Form[];
    currentUser?: User;
    filterIsVisible?: boolean = false;
    filterText: string = '';
    filtredForms?: Form[];
    formsFromBackend?: Form[];
    isEditor: boolean = false;

    constructor(private formService: FormService,
                private authenticationService : AuthenticationService,
                private router: Router,
                private dataService: DataService) {
                    this.currentUser = this.authenticationService.currentUser;
                }
                  
    ngOnInit() {
        if(this.dataService.hasData()) {
            this.forms = this.dataService.getData();
        }
        else {
            if (!this.authenticationService.GuestMode) {
                const userId = this.currentUser?.id;
                if (userId) {
                    console.log("role:" + this.currentUser?.roleAsString);
                    if (this.currentUser?.role == Role.Admin) {
                            console.log(this.currentUser?.role);
                            this.formService.getAllForms().subscribe((res) => {
                                this.forms = res;
                                this.formsFromBackend = res;
                            });
                    } else {
                            this.formService.getMyForms().subscribe((res) => {
                                this.forms = res;
                                this.formsFromBackend = res;
                                console.log(res);
                                
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
            }}
    }
    toggleFilter() {
        this.filterIsVisible = !this.filterIsVisible;
    }

    applyFilter() {
        const lowerCaseFilter = this.filterText.toLowerCase();
        this.filtredForms = this.forms?.filter((form) => 
            form.title.toLowerCase().includes(lowerCaseFilter) ||
            form.description?.toLowerCase().includes(lowerCaseFilter)||
            form.owner.firstName?.toLowerCase().includes(lowerCaseFilter) ||
            form.owner.lastName?.toLowerCase().includes(lowerCaseFilter) ||
            form.owner.email?.toLowerCase().includes(lowerCaseFilter)
        );
        
        this.filterText != '' ? this.forms = this.filtredForms : this.forms = this.formsFromBackend;
        this.dataService.setData(this.forms);
        console.log(this.forms);
    }

    openAddEditForm() {
        console.log("Navigating to addEditForm with:", {form: new Form(), isNew: true});
        this.router.navigate(["addEditForm"], {state: {form: new Form(), isNew: true}});
    }


}