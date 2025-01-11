import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from "@angular/core";
import {Question} from "../../../models/question";
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators
} from "@angular/forms";
import {Subscription} from "rxjs";
import {Answer} from "../../../models/answer";
import {plainToClass, plainToInstance} from "class-transformer";
import {th} from "date-fns/locale";
import {F} from "@angular/cdk/keycodes";
import {Instance} from "../../../models/instance";

@Component({
    selector: "check-question",
    templateUrl: "./checkQuestion.component.html",
    styleUrls: ["../instance.component.css"]
})
export class CheckQuestionComponent implements OnChanges, OnDestroy, OnInit  {
    @Input() question?: Question;
    @Input() instance?: Instance;
    @Output() validationChange = new EventEmitter<boolean>();
    public comboForm!: FormGroup;
    private answerIndex: number = 0;
   
    
  
    private subscription!: Subscription;
    constructor(private fb: FormBuilder) {
      
    }
    /*ngOnInit() {
        this.comboForm = this.fb.group({
            optionsValues: this.fb.array(this.question?.optionList?.optionValues?.
            map(option => 
                    this.fb.control({
                    optionIdx: option.idx,
                    label: option.label,
                    checked: this.question?.answers?.some(answer => answer.value === option.idx.toString())
                    
                })
            ) || [])
        },   this.question?.required ? [Validators.required] : []);
        console.log(this.comboForm.value);
        this.comboForm.valueChanges.subscribe(value => {
            this.validationChange.emit(this.question?.optionList?.optionValues?.some(option => option.checked));
            console.log(value);
        });
        this.comboForm.markAllAsTouched();
      
   
        
    }*/

   /* ngOnInit() {
        if (this.question && this.question.optionList?.optionValues) {
            console.log(this.question.answers);
            if (this.subscription) {
                this.subscription.unsubscribe();
            }
            if (this.subscription) {
                this.subscription.unsubscribe();
            }
            const optionsControls = this.question?.optionList?.optionValues?.map(option => {
                return this.fb.group({
                    optionIdx: [option.idx],
                    label: [option.label],
                    checked: [{value: this.question?.answers?.some(answer =>
                            answer.value === option.idx.toString()),
                        disabled: this.instance?.completed != null}],
                });
            }) || [];

            this.comboForm = this.fb.group({
                optionsValues: this.fb.array(optionsControls, this.atLeastOneCheckboxCheckedValidator())
            });
       

            // Écoutez les changements
            this.subscription = this.comboForm.valueChanges.subscribe(value => {
                const isValid = (this.comboForm.get('optionsValues') as FormArray)
                    .controls.some(control => control.get('checked')?.value);
              
                this.validationChange.emit(isValid);
                console.log(value);
            });

            this.comboForm.markAllAsTouched();
        }
    }*/
    initForm() {
        if (this.question && this.question.optionList?.optionValues) {
            if (this.subscription) {
                this.subscription.unsubscribe();
            }

            const optionsControls = this.question.optionList.optionValues.map(option => {
                return this.fb.group({
                    optionIdx: [option.idx],
                    label: [option.label],
                    checked: [{value: this.question?.answers?.some(answer =>
                            answer.value === option.idx.toString()),
                        disabled: this.instance?.completed != null}]
                });
            }) || [];

            this.comboForm = this.fb.group({
                optionsValues: this.fb.array(optionsControls, this.atLeastOneCheckboxCheckedValidator())
            });
            const isValid = !this.question?.required && (this.comboForm.get('optionsValues') as FormArray)
                .controls.some(control => control.get('checked')?.value);
            this.validationChange.emit(isValid);

         /*   this.subscription = this.comboForm.valueChanges.subscribe(value => {
                const isValid = !this.question?.required || (this.comboForm.get('optionsValues') as FormArray)
                    .controls.some(control => control.get('checked')?.value);
                this.validationChange.emit(isValid);
            });*/

            this.comboForm.markAllAsTouched();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['question'] && this.question && this.question.optionList?.optionValues) {
            this.initForm();
           
        }
    }
   ngOnInit() {
        if (this.question && this.question.optionList?.optionValues) {
            console.log("Initial answers:", this.question.answers);
            const isValid = !this.question?.required || (this.comboForm.get('optionsValues') as FormArray)
                .controls.some(control => control.get('checked')?.value);
            this.validationChange.emit(isValid);
            
        }
    }




    // Validateur personnalisé pour vérifier qu'au moins une checkbox est cochée
    atLeastOneCheckboxCheckedValidator(): ValidatorFn {
        return (formArray: AbstractControl): ValidationErrors | null => {
            const atLeastOneChecked = this.question?.required ?
                (formArray as FormArray).controls.some(control => control.get('checked')?.value) : true ;
            return atLeastOneChecked ? null : { required: true };
        };
    }
    

  
    
    addCheckedAnswer(checked: boolean, idx: number) {
       /* const isValid = !this.question?.required || (this.comboForm.get('optionsValues') as FormArray)
            .controls.some(control => control.get('checked')?.value);
        this.validationChange.emit(isValid);*/
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if(this.instance && checked && this.question) {
            console.log("test:", this.question.answers.length)
            this.question.answers.push({
                instanceId: this.instance?.instanceId,
                questionId: this.question.id,
                idx: this.question.answers.length + 1,
                value: idx.toString()


            });
            this.question.updated = true;
        } else if(!checked && this.question) {
            const indexToRemove = this.question.answers.findIndex(
                                answer => answer.value === idx.toString());
            if (indexToRemove > -1) {
                this.question.answers.splice(indexToRemove, 1);
            }
            
            this.question.updated = true;
        }
        
    }

    // Getter pour faciliter l'accès au FormArray
    get optionsValues(): FormArray {
        return this.comboForm.get('optionsValues') as FormArray;
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}