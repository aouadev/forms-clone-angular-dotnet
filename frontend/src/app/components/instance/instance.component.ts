import {AfterViewInit, Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from "@angular/core";
import {Form} from "src/app/models/form";
import {Router} from "@angular/router";
import {InstanceWithFormDetailed} from "src/app/models/instance";
import {InstanceService} from "src/app/services/instance.service";
import {Question} from "src/app/models/question";
import {AuthenticationService} from "src/app/services/authentication.service";
import {FormService} from "src/app/services/form.service";
import {FormBuilder} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {DeleteInstanceDialogComponent} from "./delete-instance-dialog/delete-instance-dialog.component";
import {Role} from "../../models/user";

@Component({
    selector: 'instance',
    templateUrl: './instance.component.html',
    styleUrls: [
        '../nav-bar/nav-bar.component.css',
        '../view-forms/view-forms.component.css',
        './instance.component.css'
    ]
})
export class InstanceComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy{
    form: Form;
    readOnly: boolean = false;
    isNew: boolean = false;
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
                private fb : FormBuilder,
                private dialog: MatDialog,){
        const navigation = this.router.getCurrentNavigation();
        this.form = navigation?.extras.state?.['form'];
        this.readOnly = navigation?.extras.state?.['readOnly'];
        this.isNew = navigation?.extras.state?.['isNew'];
       
        
     
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes[('questionNumber')]) {
            this.currentQuestion = this.questions?.[this.questionNumber];
            this.isAllValid = this.questions?.every(q => q.isValid );
            
        }
    }
 
    ngOnInit() {
        if (this.authenticationService.GuestMode) {
            this.formService.getFormForGuest(this.form?.formId).subscribe((res) => {
                console.log("res", res);
                this.instance = res;
                this.form = this.instance.form || this.form;
                this.questions = this.form.questions;
                this.currentQuestion = this.questions[this.questionNumber];
                this.isAllValid = this.questions.every(q => (q.required && q.answers.length > 0) || !q.required);

            });
            
        } else {
            if (this.form.lastInstance && !this.isNew) {
                this.instanceService.getInstance(this.form?.lastInstance.instanceId, this.readOnly).subscribe((res) => {
                    this.instance = res;
                    this.form = this.instance.form || this.form;
                    this.questions = this.form?.questions.map(q => {
                            q.isValid = !q.required || (q.answers && q.answers.length > 0);
                            return q;
                        }
                    );
                    this.currentQuestion = this.questions[this.questionNumber];
                    console.log("currentquestion instance ", this.currentQuestion);
                    console.log("instance", this.instance);
                    this.isAllValid = this.questions.every(q => q.isValid);
                    /* this.frm = this.fb.group({
                         questionsCtl: this.fb.array((this.questions)?.map(question => {
                             this.ctlShortAnswer = this.fb.control('',question?.required ? [Validators.required] : []);
                         }))
                     })
                     console.log('frm: ', this.frm);*/


                });

            } else {
                this.formService.getFormWithquestions(this.form?.formId).subscribe((res) => {
                    this.instance = res;
                    this.form = this.instance.form || this.form;
                    this.questions = this.form.questions;
                    this.currentQuestion = this.questions[this.questionNumber];
                    this.isAllValid = this.questions.every(q => (q.required && q.answers.length > 0) || !q.required);

                });
            }
        }
        
    }
    
      ngAfterViewInit(): void {
      
    }

    arrowBack() {
       // console.log('frm valid: ', this.frm.valid);
    }
    //méthode pour mettre à jour la validation globale et gérer le bouton sanve
    onValidationChange(isValid: boolean, questionIndex: number) {
        console.log("onvalidation:", isValid);
        if (this.questions && this.questions[questionIndex]) {
            this.questions[questionIndex].isValid = isValid;
            this.isAllValid = this.questions.every(q => q.isValid !== undefined && q.isValid);
            console.log("all valid:", this.isAllValid);
            console.log('questions: ', this.questions);
        }
    }

    incrementQuestion() {
        if (this.currentQuestion && !this.readOnly) {
            this.saveCurrentQuestionAnswer();
        }

        if (this.questions && this.questionNumber < this.questions.length - 1) {
            ++this.questionNumber;
            this.currentQuestion = this.questions[this.questionNumber];
        }
    }

    decrementQuestion() {
       if (this.currentQuestion && !this.readOnly) {
            this.saveCurrentQuestionAnswer();
        }

        if (this.questionNumber > 0) {
            --this.questionNumber;
            this.currentQuestion = this.questions?.[this.questionNumber];
        }
    }

    saveCurrentQuestionAnswer() {
        if (this.currentQuestion && this.currentQuestion.answers 
            && this.currentQuestion.answers.length > 0 && this.currentQuestion.updated) {
            console.log('guestanswers:', this.currentQuestion.answers);
            if (this.authenticationService.GuestMode) {
                console.log('guestMode', this.authenticationService.GuestMode);
                this.instanceService.addGuestAnswer(this.currentQuestion.answers).subscribe(res => {
                    console.log("servor:", res);
                    if (this.currentQuestion) {
                        this.currentQuestion.updated = false;
                    }
                });
                
            }
            else {
                console.log('guestMode else', this.authenticationService.GuestMode);
                this.instanceService.addAnswer(this.currentQuestion.answers).subscribe(res => {
                    console.log("servor:", res);
                    if (this.currentQuestion) {
                        this.currentQuestion.updated = false;
                    }
                });
            }
        }
    }
    saveInstance() {
        if(this.instance && this.isAllValid) {
            console.log("instance to save" , this.instance);
            
            this.instanceService.addNewInstance(this.instance).subscribe(res => {
                console.log("allValid!", res);
                this.router.navigate(['view_forms']);
            })
            
        }
    }
    deleteInstance() {
        this.dialog.open(DeleteInstanceDialogComponent, {autoFocus: true}).afterClosed().subscribe(res => {
            if (res && this.instance ) {
                this.instanceService.deleteInstance(this.instance.instanceId).subscribe(res => {
                    console.log("deleted:", res);
                    this.router.navigate(['view_forms']);

                })
            }

        });
        
    }

    ngOnDestroy() {
        if (this.currentQuestion ) {
            this.saveCurrentQuestionAnswer();
        }
    }

}