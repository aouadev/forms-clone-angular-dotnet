import {Component, Input, OnInit, SimpleChanges} from "@angular/core";

import {Question} from "../../../models/question";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import { OptionValue } from "src/app/models/optionValue";
//import {Q} from "@angular/cdk/keycodes";
//import {Option} from "@angular/cli/src/command-builder/utilities/json-schema";

@Component({
    selector: "combo-question",
    templateUrl: "./comboQuestion.component.html",
    styleUrls: ["../instance.component.css"]
})
export class ComboQuestionComponent implements OnInit{
    @Input() question?: Question;
    @Input() instanceId?: number;
    public comboForm!: FormGroup;
    public selectedOption!: FormControl;
    private subscription!: Subscription;
    constructor(private fb: FormBuilder) {}
    
    ngOnInit() {
        if (this.question?.optionList?.optionValues){
            this.comboForm = this.fb.group({
                optionValues: this.fb.array(this.question.optionList.optionValues.map(option => 
                    this.fb.control({
                        optionIdx: option.idx,
                        label: option.label,
                       
                        //selected: [this.question?.answers?.some(answer => answer.value === option.idx.toString())]
                    })
                ))
            });

            const answer = this.question.answers?.[0]?.value;
            this.selectedOption = this.fb.control(
                this.question.optionList.optionValues.find(
                    option => option.idx.toString() === answer)
            )
            this.selectedOption.valueChanges.subscribe(value => {
                console.log("value:::" + value);
                if(this.question?.answers) {
                    this.question.answers[0] = {
                        instanceId: this.instanceId || 0,
                        questionId: this.question?.id,
                        idx : 0,
                        value : value.toString()
                    };
                }
                if (this.question) {
                    this.question.updated = true;
                }
            });
            

            

        
           /* if (answer) {
                this.selectedOption = this.question.optionList.optionValues.find(
                    option => option.idx.toString() === answer);
            }*/
            console.log(this.comboForm.value);
            console.log(this.question.optionList.optionValues);
         
            
        }
    }
    
}