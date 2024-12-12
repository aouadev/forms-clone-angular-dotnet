import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {Question} from "../../../models/question";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
    selector: 'integer-question',
    templateUrl: 'integerQuestion.component.html',
    styleUrls: ['../instance.component.css']
    
})
export class IntegerQuestionComponent implements OnChanges {
    @Input() question?: Question;
    @Input() instanceId?: number;
    public ctlIntegerAnswer!: FormControl;
    private subscription!: Subscription;
    
    constructor(private fb: FormBuilder) {}
    
    ngOnChanges(changes: SimpleChanges): void {
        if(changes['question'] && this.question) {
            if(this.subscription) {
                this.subscription.unsubscribe();
            }
            this.ctlIntegerAnswer  = this.fb.control(
                this.question?.answers?.[0]?.value || '',
                this.question?.required ? [Validators.required, Validators.pattern(/^\d+$/)] : []
            )
            this.ctlIntegerAnswer.valueChanges.subscribe(value => {
                if (this.question?.answers) {
                    this.question.answers[0] = {
                        instanceId: this.instanceId || 0,
                        questionId: this.question.id,
                        idx: 0,
                        value: value
                    };
                }
            });
            this.ctlIntegerAnswer.markAllAsTouched();
        }
    }
    
}