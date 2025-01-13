import { I18nPluralPipe } from "@angular/common";
import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from "@angular/core";
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import { Answer } from "src/app/models/answer";
import { Instance } from "src/app/models/instance";
import { OptionValue } from "src/app/models/optionValue";
import { Question } from "src/app/models/question";
import {Subscription} from "rxjs";

@Component({
    selector:'question-card',
    templateUrl:'questionCard.component.html',
    styleUrls:[
        'instance.component.css'
    ]
})
export class QuestionCardComponent implements OnChanges{
    @Input() question?: Question;
    @Input() instance?: Instance;
    @Input() frm!: FormGroup;
    @Input() index!: number;
    @Input() errorMessages!: string[];
    @Output() validationChange = new EventEmitter<boolean>(); // Événement pour notifier le parent
  
    
    /*answerValue: string = "";
    selectedValue: string ="";
    dateValue: string = "";
    emailValue: string = "";
    emailForm: FormGroup;
   // integerForm: FormGroup;*/
    
    constructor(private fb: FormBuilder) {
     
      }
      ngOnChanges() {
        console.log("oninit");
        console.log(this.question?.type);
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

  

   


}
