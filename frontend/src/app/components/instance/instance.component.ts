import { Component, ViewChild, ElementRef, OnInit, OnChanges, SimpleChanges, AfterContentChecked, AfterViewInit } from "@angular/core";
import { Form } from "src/app/models/form";
import { Router } from "@angular/router";
import { Instance, InstanceWithFormDetailed } from "src/app/models/instance";
import { InstanceService } from "src/app/services/instance.service";
import { Question} from "src/app/models/question";
import { Answer } from "src/app/models/answer";
import { AuthenticationService } from "src/app/services/authentication.service";
import { FormService } from "src/app/services/form.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {forEach} from "lodash-es";
import {F} from "@angular/cdk/keycodes";

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
    form: Form;
    readOnly: boolean = false;
    submit: boolean = false;
    instance?: InstanceWithFormDetailed;
    questions?: Question[] ;
    questionNumber: number = 0;
    currentQuestion?: Question;
  //  public frm!: FormGroup;
   // public ctlShortAnswer!: FormControl;
    isAllValid?: boolean;
   


    
    constructor(private router: Router,
                 private instanceService: InstanceService,
                 private formService: FormService,
                private authenticationService: AuthenticationService,
                private fb : FormBuilder){
        const navigation = this.router.getCurrentNavigation();
        this.form = navigation?.extras.state?.['form'];
        this.readOnly = navigation?.extras.state?.['readOnly'];
       
        
     
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes[('questionNumber')]) {
            this.currentQuestion = this.questions?.[this.questionNumber];
        }
    }
 
    ngOnInit() {

        if (this.form.lastInstance) {
            this.instanceService.getInstance(this.form?.lastInstance.instanceId, this.readOnly).subscribe((res) => {
                this.instance = res;
                this.form = this.instance.form || this.form;
                this.questions = this.form?.questions;
                this.currentQuestion = this.questions[this.questionNumber];
                console.log("currentquestion instance ", this.currentQuestion);
                console.log("instance", this.instance);
                this.isAllValid = this.questions.every(q => (q.required && q.answers.length > 0) || !q.required );
               /* this.frm = this.fb.group({
                    questionsCtl: this.fb.array((this.questions)?.map(question => {
                        this.ctlShortAnswer = this.fb.control('',question?.required ? [Validators.required] : []);
                    }))
                })
                console.log('frm: ', this.frm);*/
              
              
            });
           
        }
        else {
            this.formService.getFormWithquestions(this.form?.formId).subscribe((res) => {
                this.instance = res;
                this.form  = this.instance.form || this.form;
                this.questions = this.form.questions;
                this.currentQuestion = this.questions[this.questionNumber];
                this.isAllValid = this.questions.every(q => (q.required && q.answers.length > 0) || !q.required );
              
            });
        }
    }
    ngAfterViewInit(): void {
      
    }

    arrowBack() {
       // console.log('frm valid: ', this.frm.valid);
    }
    //méthode pour mettre à jour la validation globale et gérer le bouton sanve
    onValisationChange(isValid: boolean, questionIndex: number) {
        console.log("onvalidation:", isValid);
    
        
        if (this.questions) {
            this.questions[questionIndex].isValid = isValid;
            this.isAllValid = this.questions.every(q => q.isValid);
            console.log("all valid:", this.isAllValid);
            console.log('questions: ', this.questions);
        }
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
            this.currentQuestion = this.questions?.[this.questionNumber];
        }
    }


    protected readonly Question = Question;
}