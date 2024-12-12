import {Component, Input, OnChanges, SimpleChanges} from "@angular/core";
import {Question} from "../../../models/question";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
    selector: "check-question",
    templateUrl: "./check-question.component.html",
    styleUrls: ["../instance.component.css"]
})
export class CheckQuestionComponent implements OnChanges {
    @Input() question?: Question;
    @Input() instanceId?: number;
    public ctlCheckAnswer!: FormControl;
    private subscription!: Subscription;
    constructor(private fb: FormBuilder) {}
    
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['question'] && this.question) {
            if(this.subscription) {
                this.subscription.unsubscribe();
            }
            this.ctlCheckAnswer = this.fb.control(
                this.question?.answers?.[0]?.value || ''
            )
            this.ctlCheckAnswer.valueChanges.subscribe(value => {
                if(this.question?.answers) {
                    this.question.answers[0] = {
                        instanceId: this.instanceId || 0,
                        questionId: this.question.id,
                        idx : 0,
                        value : value
                    };
                }
            });
            this.ctlCheckAnswer.markAllAsTouched();
        }
    }
    
    
}