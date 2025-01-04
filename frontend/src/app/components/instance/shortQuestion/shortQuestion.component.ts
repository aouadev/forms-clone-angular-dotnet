import {Component, Input, OnChanges, SimpleChanges, OnDestroy, Output, EventEmitter} from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { Question} from "src/app/models/question";
import {F} from "@angular/cdk/keycodes";

@Component({
    selector: 'short-question',
    templateUrl: 'shortQuestion.component.html',
    styleUrls: [
        '../instance.component.css'
    ]
})
export class ShortQuestionComponent implements OnChanges, OnDestroy {
    @Input() question?: Question;
    @Input() instanceId?: number;
    @Input() ctlShortAnswer!: FormControl;
    @Output() validationChange = new EventEmitter<boolean>();
    private subscription!: Subscription;

    constructor(private fb: FormBuilder) {
       
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['question'] && this.question) {
            if (this.subscription) {
                this.subscription.unsubscribe();
            }
            this.ctlShortAnswer = this.fb.control(
                this.question?.answers?.[0]?.value || '', 
                this.question?.required ? [Validators.required] : []
            );
            this.validationChange.emit(this.ctlShortAnswer.valid);
           

           
            this.subscription = this.ctlShortAnswer.valueChanges.subscribe(value => {
                console.log('value:::' + value);
                console.log('ctl valid: ', this.ctlShortAnswer.valid);
              
            
                this.validationChange.emit(this.ctlShortAnswer.valid);
                
               
                if (this.question?.answers) {
                    this.question.answers[0] = {
                        instanceId: this.instanceId || 0,
                        questionId: this.question.id,
                        idx: 0,
                        value: value
                    };
                }
                if (this.question) {
                    this.question.updated = true;
                }
               
            });
            this.ctlShortAnswer.markAllAsTouched();
        }
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
