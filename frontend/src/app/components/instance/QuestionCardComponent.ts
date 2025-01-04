import { I18nPluralPipe } from "@angular/common";
import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import { Answer } from "src/app/models/answer";
import { Instance } from "src/app/models/instance";
import { OptionValue } from "src/app/models/optionValue";
import { Question } from "src/app/models/question";

@Component({
    selector:'question-card',
    templateUrl:'questionCard.component.html',
    styleUrls:[
        'instance.component.css'
    ]
})
export class QuestionCardComponent {
    @Input() question?: Question;
    @Input() instance?: Instance;
    @Input() frm!: FormGroup;
    @Input() index!: number;
    @Input() ctlShortAnswer!: FormControl;
    @Output() validationChange = new EventEmitter<boolean>(); // Événement pour notifier le parent
    
    /*answerValue: string = "";
    selectedValue: string ="";
    dateValue: string = "";
    emailValue: string = "";
    emailForm: FormGroup;
   // integerForm: FormGroup;*/
    
    constructor(private fb: FormBuilder) {
      
        /*this.emailForm = this.fb.group({
            email: ['',[Validators.required, Validators.email]]
        });
        this.integerForm = this.fb.group({
            integer: ['', [Validators.required, this.integerValidator]]
        })
        console.log("Selected value:", this.selectedValue);*/
      }
    


    integerValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (value === null || value === undefined || value === '') {
            return null;
        }
        console.log(Number.isInteger(+value))
        return Number.isInteger(+value) ? null : { notInteger: true};
      }
    onValidationChange(isValid: boolean) {
        this.validationChange.emit(isValid);
    }

  
          
      
        getAnswerValue(){
            /*if (!this.question?.answers[0]) {
              this.question.answers[0] = Object.assign(new Answer(), {
                instanceId: this.instance?.instanceId,
                questionId: this.question?.id,
                idx: 0,
                value: '',
              });
            }
          
            return this.question?.answers[0].value;*/
          }
          
          setAnswerValue(value: string): void {
           /* if (!this.question.answers[0]) {
              this.question.answers[0] = Object.assign(new Answer(), {
                instanceId: this.instance?.instanceId,
                questionId: this.question.id,
                idx: 0,
              });
            }
            this.question.answers[0].value = value;*/
          }            
 

    isChecked(idx: number) {
        return this.question?.answers.some(answer => Number(answer.value) == idx)
    }

    onCheckboxChange(checked: boolean, idx: number): void {
       /* const answers = this.question?.answers;
        if (checked) {
            // answers.push({ value: idx });
            console.log("answer");
        } else {

          const indexToRemove = answers?.findIndex(answer => Number(answer.value) === idx);
          if (indexToRemove > -1) {
            answers.splice(indexToRemove, 1);
          }
        }*/
      }

      isValidEmail() {

      }

        // Appelé lors du changement de sélection dans le mat-select
  /*onSelectionChange(event: any): void {
    this.selectedValue = event.value; // Récupère la valeur sélectionnée
    console.log('Selected value:', this.selectedValue);
  }*/
      
      
      
}
