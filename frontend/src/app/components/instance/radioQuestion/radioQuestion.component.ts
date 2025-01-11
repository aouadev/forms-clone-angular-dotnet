import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { Question } from "src/app/models/question";
import {Subscription} from "rxjs";
import {Instance} from "../../../models/instance";

@Component({
    selector:"radio-question",
    templateUrl:"radioQuestion.component.html",
    styleUrls:[
        "../instance.component.css"
    ]

})
export class RadioQuestionComponent implements OnInit, OnDestroy {
    @Input() question?: Question;
    @Input() instance?: Instance;
    @Output() validationChange = new EventEmitter<boolean>();
    public selectedOption!: FormControl;
    private subscription!: Subscription;


    constructor(private fb: FormBuilder) {

    }

    ngOnInit(): void {
        if (this.question) {
            if (this.subscription) {
                this.subscription.unsubscribe();
            }
            const answer = this.question.answers?.[0];
            this.selectedOption = this.fb.control({value: 
                    this.question.optionList?.optionValues.find(
                option => option.idx.toString() == answer?.value),
                disabled: this.instance?.completed != null },
                this.question?.required ? [Validators.required] : []);
            //this.validationChange.emit(this.selectedOption.valid);

            this.subscription = this.selectedOption.valueChanges.subscribe(value => {
            this.validationChange.emit(this.selectedOption.valid);
                console.log(value);
                if (this.instance && this.question?.answers && this.selectedOption.valid) {
                    this.question.answers[0] = {
                        instanceId: this.instance?.instanceId,
                        questionId: this.question.id,
                        idx: 0,
                        value: value.toString()

                    }
                    this.question.updated = true;
                }


            });
        }
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
