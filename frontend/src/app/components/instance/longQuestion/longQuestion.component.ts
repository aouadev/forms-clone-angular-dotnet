import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from "@angular/core";
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
    @Input() instance?: Instance;
    public ctlLongAnswer!: FormControl;
    private subscription!: Subscription;
    @Output() validationChange = new EventEmitter<boolean>();
    
    constructor(private fb: FormBuilder) {}
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['question'] && this.question) {
            if (this.subscription) {
                this.subscription.unsubscribe();
            }
            this.ctlLongAnswer = this.fb.control(
                {value: this.question?.answers?.[0]?.value || '', disabled: this.instance?.completed != null},
                this.question?.required ? [Validators.required] : []
            );
          
            this.subscription = this.ctlLongAnswer.valueChanges.subscribe(value => {
                this.validationChange.emit(this.ctlLongAnswer.valid);
                if(this.instance && this.question?.answers && this.ctlLongAnswer.valid) {
                    this.question.answers[0] = {
                        instanceId: this.instance?.instanceId,
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