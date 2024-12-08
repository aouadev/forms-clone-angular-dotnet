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
     
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes[('questionNumber')]) {
            this.currentQuestion = this.questions[this.questionNumber];
        }
    }
 
    ngOnInit() {
        this.instance = Object.assign(new InstanceWithFormDetailed(), {
            formId: this.form.formId,
            userId: this.authenticationService.currentUser?.id,
            started: new Date(),
           
        });
        if (!this.form.lastInstance) {
          
            this.formService.getFormWithquestions(this.form?.formId).subscribe((res) => {
                this.form = res;
                this.form.lastInstance = this.instance;
                this.questions = this.form.questions;
                this.currentQuestion = this.questions[this.questionNumber];
              
            });

        }
        else {
        this.instanceService.getInstance(this.form?.lastInstance.instanceId).subscribe((res) => {
            if(res.form) {
                this.form = res.form;
                this.questions = this.form.questions;
                this.currentQuestion = this.questions[this.questionNumber];
            }
           /* if (!this.instance.completed) {
               //var newInstance = Object.assign(new InstanceWithFormDetailed(), {started: new Date()});
               this.instance.instanceId = 0;
               this.instance.started = new Date();
               
                
            }*/

         
           // this.currentQuestion = this.questions[this.questionNumber];
         
        });
    }
    this.instance.form = this.form;
    this.instanceService.addNewInstance(this.instance).subscribe((res) =>{
        this.instance = res;
    })

    }
    ngAfterViewInit(): void {
      
    }

    arrowBack() {
        this.router.navigate(['/forms']);
    }
    
    incrementQuestion() {
        if ( this.questions && this.questionNumber < this.questions.length - 1){
          //  console.log(this.currentQuestion?.answers[0].value);
            ++this.questionNumber;
            this.currentQuestion = this.questions[this.questionNumber];
           // console.log('title     ' + this.currentQuestion?.title);
            //console.log(this.currentQuestion?.answers[0].value);
           // if (this.currentQuestion.answers[0].value != '') {
           // this.instanceService.add(this.currentQuestion.answers[0]).subscribe();
        //}
    }
        
    }

    decrementQuestion() {
        if (this.questionNumber > 0)
            --this.questionNumber;
        
    }
  
      
}