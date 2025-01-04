import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from "@angular/core";
import {Instance} from "../../../models/instance";
import {Question} from "../../../models/question";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
    selector: "date-question",
    templateUrl: "./dateQuestion.component.html",
    styleUrls: ["../instance.component.css"]
})
export class DateQuestionComponent implements OnChanges {
    @Input() question?: Question;
    @Input() instanceId?: number;
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
                this.question?.answers?.[0]?.value || '',
                this.question?.required ? [Validators.required, Validators.pattern(/^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/)


                ] : []
            );
            this.validationChange.emit(this.ctlDateAnswer.valid);
            this.ctlDateAnswer?.valueChanges.subscribe(value => {
                this.validationChange.emit(this.ctlDateAnswer.valid);
                if(this.question?.answers) {
                    this.question.answers[0] = {
                        instanceId: this.instanceId || 0,
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
    
}