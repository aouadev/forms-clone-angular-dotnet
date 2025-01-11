import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from "@angular/core";
import {Instance} from "../../../models/instance";
import {Question} from "../../../models/question";
import {FormBuilder, FormControl, ValidationErrors, Validators} from "@angular/forms";
import {Subscription} from "rxjs";

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {da} from "date-fns/locale";


@Component({
    selector: "date-question",
    templateUrl: "./dateQuestion.component.html",
    styleUrls: ["../instance.component.css"]
})
export class DateQuestionComponent implements OnChanges {
    @Input() question?: Question;
    @Input() instance?: Instance;
    @Output() validationChange = new EventEmitter<boolean>();
    public ctlDateAnswer!: FormControl;
    private subscription!: Subscription;
    
    constructor(private fb: FormBuilder) {}
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['question'] && this.question) {
            if(this.subscription) {
                this.subscription.unsubscribe();
            }
            this.ctlDateAnswer = this.fb.control(
                {value: this.question?.answers?.[0]?.value || '', disabled: this.instance?.completed != null},
                this.question?.required ? [Validators.required, //this.dateValidator
                ] : []
            );
           this.subscription = this.ctlDateAnswer?.valueChanges.subscribe(value => {
                this.validationChange.emit(this.ctlDateAnswer.valid);
                if(this.instance && this.question?.answers && this.ctlDateAnswer.valid) {
                    this.question.answers[0] = {
                        instanceId: this.instance?.instanceId,
                        questionId: this.question?.id,
                        idx : 0,
                        value : value
                    };
                }
                if (this.question) {
                    this.question.updated = true;
                }
            });
            this.ctlDateAnswer?.markAllAsTouched();
        }
    }

    dateValidator(control: FormControl): ValidationErrors | null {
        const dateString = control.value as string;
        const regExp = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
        if(!regExp.test(dateString)) {
            console.log("invalidDate");
            return {invalidDate: true};
            
        }
        console.log("validDate");
        return null;
    }
    
}