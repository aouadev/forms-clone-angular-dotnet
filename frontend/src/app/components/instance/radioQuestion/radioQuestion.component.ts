import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { Question } from "src/app/models/question";
import {Subscription} from "rxjs";

@Component({
    selector:"radio-question",
    templateUrl:"radioQuestion.component.html",
    styleUrls:[
        "../instance.component.css"
    ]

})
export class RadioQuestionComponent implements OnInit {
    @Input() question?: Question;
    @Input() instanceId?: number;
    @Output() validationChange = new EventEmitter<boolean>();
    public selectedOption!: FormControl;
    private subscription!: Subscription;


    constructor(private fb: FormBuilder) {

    }

    ngOnInit(): void {
        if (this.question) {
            const answer = this.question.answers?.[0];
            this.selectedOption = this.fb.control(this.question.optionList?.optionValues.find(
                option => option.idx.toString() == answer?.value), this.question?.required ? [Validators.required] : []);
            this.validationChange.emit(this.selectedOption.valid);

            this.selectedOption.valueChanges.subscribe(value => {
            this.validationChange.emit(this.selectedOption.valid);
                console.log(value);
                if (this.question?.answers) {
                    this.question.answers[0] = {
                        instanceId: this.instanceId || 0,
                        questionId: this.question.id,
                        idx: 0,
                        value: value.toString()

                    }
                    this.question.updated = true;
                }


            });
        }
    }
}
