import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {Question} from "../../../models/question";
import {Instance} from "../../../models/instance";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
    selector: "long-question",
    templateUrl: "longQuestion.component.html",
    styleUrls: [
        '../instance.component.css'
    ]
})
export class LongQuestionComponent implements OnChanges {
    @Input() question?: Question;
    @Input() instanceId?: number;
    public ctlLongAnswer!: FormControl;
    private subscription!: Subscription;
    
    constructor(private fb: FormBuilder) {}
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['question'] && this.question) {
            if (this.subscription) {
                this.subscription.unsubscribe();
            }
            this.ctlLongAnswer = this.fb.control(
                this.question?.answers?.[0]?.value || '',
                this.question?.required ? [Validators.required] : []
            );
            this.subscription = this.ctlLongAnswer.valueChanges.subscribe(value => {
                if(this.question?.answers) {
                    this.question.answers[0] = {
                        instanceId: this.instanceId || 0,
                        questionId: this.question.id,
                        idx: 0,
                        value : value
                    };
                }
                if (this.question) {
                    this.question.updated = true;
                }
            });
            this.ctlLongAnswer.markAllAsTouched();
        }
    }
    
    
}