import { Component, ViewChild, ElementRef } from "@angular/core";
import { Form, FormDetailed } from "src/app/models/form";
import { Router } from "@angular/router";
import { Instance, InstanceWithFormDetailed } from "src/app/models/instance";
import { InstanceService } from "src/app/services/instance.service";
import { Question } from "src/app/models/question";
import { Answer } from "src/app/models/answer";
import { AuthenticationService } from "src/app/services/authentication.service";
import { FormService } from "src/app/services/form.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: 'instance',
    templateUrl: './instance.component.html',
    styleUrls: [
        '../nav-bar/nav-bar.component.css',
        '../view-forms/view-forms.component.css',
        './instance.component.css'
    ]
})
export class InstanceComponent {
    form: FormDetailed;
    submit: boolean = false;
    instance?: InstanceWithFormDetailed;
    questions: Question[] = [];
    questionNumber: number = 0;
   


    
    constructor(private router: Router,
                 private instanceService: InstanceService,
                 private formService: FormService,
                private authenticationService: AuthenticationService){
        const navigation = this.router.getCurrentNavigation();
        this.form = navigation?.extras.state?.['form'];
     
    }

    ngOnInit() {
        if (!this.form.lastInstance) {
            this.instance = Object.assign(new InstanceWithFormDetailed(), {
                formId: this.form.formId,
                userId: this.authenticationService.currentUser?.id,
                started: new Date(),
               
            });
            this.formService.getFormWithquestions(this.form?.formId).subscribe((res) => {
                this.form = res;
                this.form.lastInstance = this.instance;
                this.questions = this.form.questions;
            });

        }
        else {
        this.instanceService.getInstance(this.form?.lastInstance.instanceId).subscribe((res) => {
            this.instance = res;
            if(this.instance.form) {
                this.questions = this.instance.form.questions;
            }
            if (!this.instance.completed) {
               //var newInstance = Object.assign(new InstanceWithFormDetailed(), {started: new Date()});
               this.instance.instanceId = 0;
               this.instance.started = new Date();
               
                
            }

         
            console.log(res);
        })
    }
    }

    arrowBack() {
        this.router.navigate(['/forms']);
    }
    
    incrementQuestion() {
        if ( this.questions && this.questionNumber < this.questions.length - 1)
            ++this.questionNumber;
        
    }

    decrementQuestion() {
        if (this.questionNumber > 0)
            --this.questionNumber;
        
    }
  
      
}