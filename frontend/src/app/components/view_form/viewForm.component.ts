import { InputModalityDetector } from "@angular/cdk/a11y";
import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "src/app/models/user";
import { Form, FormWithQuestions } from "src/app/models/form";
import { FormService } from "src/app/services/form.service";

@Component({
    selector: "view-form",
    templateUrl: "viewForm.component.html",
    styleUrls: [
        '../nav-bar/nav-bar.component.css',
        '../view-forms/view-forms.component.css',
        "../instance/instance.component.css",
        "./viewForm.component.css"
    ]
})
export class ViewFormComponent implements OnInit{

    form: FormWithQuestions;
    owner?: User;
    

    constructor(private router: Router,
                private formService: FormService

    ) {
        const navigation = this.router.getCurrentNavigation();
        this.form = navigation?.extras?.state?.['form'];
        //this.owner = navigation?.extras?.state?.['form.owner'];
        
    }

    arrowBack() {
        this.router.navigate(['/view_forms']);
    }

    ngOnInit(): void {
        if (this.form){
            this.formService.getForm(this.form.formId).subscribe(res =>{
                console.log("res: " + res.questions.map(q => q.title));
                this.form = res;
                this.form.questions = res.questions;
                console.log("this form coucou:" + this.form.title  + "    " + this.form.questions);
               
            });
           
        }
        this.owner = this.form.owner;
        console.log("owner" + this.form.owner.firstName);
    
    }

}