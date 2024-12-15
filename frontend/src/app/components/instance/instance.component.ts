import { Component, ViewChild, ElementRef, OnInit, OnChanges, SimpleChanges, AfterContentChecked, AfterViewInit } from "@angular/core";
import { Form, FormDetailed } from "src/app/models/form";
import { Router } from "@angular/router";
import { Instance, InstanceWithFormDetailed } from "src/app/models/instance";
import { InstanceService } from "src/app/services/instance.service";
import { Question } from "src/app/models/question";
import { Answer } from "src/app/models/answer";
import { AuthenticationService } from "src/app/services/authentication.service";
import { FormService } from "src/app/services/form.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {forEach} from "lodash-es";

@Component({
    selector: 'instance',
    templateUrl: './instance.component.html',
    styleUrls: [
        '../nav-bar/nav-bar.component.css',
        '../view-forms/view-forms.component.css',
        './instance.component.css'
    ]
})
export class InstanceComponent implements OnInit, OnChanges, AfterViewInit{
    form: FormDetailed;
    readOnly: boolean = false;
    submit: boolean = false;
    instance?: InstanceWithFormDetailed;
    questions: Question[] = [];
    questionNumber: number = 0;
    currentQuestion?: Question;
   


    
    constructor(private router: Router,
                 private instanceService: InstanceService,
                 private formService: FormService,
                private authenticationService: AuthenticationService){
        const navigation = this.router.getCurrentNavigation();
        this.form = navigation?.extras.state?.['form'];
        this.readOnly = navigation?.extras.state?.['readOnly'];
     
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes[('questionNumber')]) {
            this.currentQuestion = this.questions[this.questionNumber];
        }
    }
 
    ngOnInit() {

        if (this.form.lastInstance) {
            this.instanceService.getInstance(this.form?.lastInstance.instanceId, this.readOnly).subscribe((res) => {
                this.instance = res;
                this.form = this.instance.form || this.form;
                this.questions = this.form.questions;
                this.currentQuestion = this.questions[this.questionNumber];
                console.log("instanceid ;;;;=: "+ this.instance.instanceId);
            });
        }
        else {
            this.formService.getFormWithquestions(this.form?.formId).subscribe((res) => {
                this.instance = res;
                this.form  = this.instance.form || this.form;
                this.questions = this.form.questions;
                this.currentQuestion = this.questions[this.questionNumber];
              
            });
        }
    }
    ngAfterViewInit(): void {
      
    }

    arrowBack() {
        this.router.navigate(['/view_forms']);
    }
    
    incrementQuestion() {
        if ( this.questions && this.questionNumber < this.questions.length - 1){
            if (this.currentQuestion && !this.readOnly) {
                if (this.currentQuestion.answers && this.currentQuestion.answers.length > 0 && this.currentQuestion.updated) {
                    this.instanceService.addAnswer(this.currentQuestion.answers).subscribe();
                }
            }
            ++this.questionNumber;
            this.currentQuestion = this.questions[this.questionNumber];
    }
        
    }

    decrementQuestion() {
        if (this.questionNumber > 0) {
            --this.questionNumber;
            this.currentQuestion = this.questions[this.questionNumber];
        }
    }
  
      
}