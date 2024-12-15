import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Question } from "src/app/models/question";

@Component({
    selector:"radio-question",
    templateUrl:"radioQuestion.component.html",
    styleUrls:[
        "../instance.component.css"
    ]

})
export class radioQuestionComponent implements OnInit{
    @Input() question?: Question;
    @Input() instanceId?: number;
    public selectedOption!: FormControl;
    

    constructor(private fb: FormBuilder) {

    }

    ngOnInit(): void {
        if(this.question) {
            const answer = this.question.answers?.[0];
            this.selectedOption = this.fb.control(this.question.optionList?.optionValues.find(
                option => option.idx.toString() == answer?.value));
            console.log("selectedOption:   " + this.selectedOption.value)

            this.selectedOption.valueChanges.subscribe(value => {
                console.log(value);
                if (this.question?.answers) {
                    this.question.answers[0] = {
                        instanceId : this.instanceId || 0,
                        questionId : this.question.id,
                        idx : 0,
                        value : value.toString()

                    }
                    this.question.updated = true;
                }

                
            });
        }
    }

}