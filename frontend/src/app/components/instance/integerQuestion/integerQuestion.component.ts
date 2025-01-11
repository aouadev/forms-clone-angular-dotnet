import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from "@angular/core";
import {Question} from "../../../models/question";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {Instance} from "../../../models/instance";

@Component({
    selector: 'integer-question',
    templateUrl: 'integerQuestion.component.html',
    styleUrls: ['../instance.component.css']
    
})
export class IntegerQuestionComponent implements OnChanges {
    @Input() question?: Question;
    @Input() instance?: Instance;
    public ctlIntegerAnswer!: FormControl;
    @Output() validationChange = new EventEmitter<boolean>();
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
            );
       
           this.subscription = this.ctlIntegerAnswer.valueChanges.subscribe(value => {
                this.validationChange.emit(this.ctlIntegerAnswer.valid);
                if (this.instance && this.question?.answers) {
                    this.question.answers[0] = {
                        instanceId: this.instance?.instanceId|| 0,
                        questionId: this.question.id,
                        idx: 0,
                        value: value
                    };
                }
                if (this.question) {
                    this.question.updated = true;
                }
            });
            this.ctlIntegerAnswer.markAllAsTouched();
        }
    }
    
}