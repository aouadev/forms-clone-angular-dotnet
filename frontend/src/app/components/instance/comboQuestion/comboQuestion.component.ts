import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from "@angular/core";

import {Question} from "../../../models/question";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import { OptionValue } from "src/app/models/optionValue";
import {Instance} from "../../../models/instance";
//import {Q} from "@angular/cdk/keycodes";
//import {Option} from "@angular/cli/src/command-builder/utilities/json-schema";

@Component({
    selector: "combo-question",
    templateUrl: "./comboQuestion.component.html",
    styleUrls: ["../instance.component.css"]
})
export class ComboQuestionComponent implements OnInit{
    @Input() question?: Question;
    @Input() instance?: Instance;
    public comboForm!: FormGroup;
    public selectedOption!: FormControl;
    @Output() validationChange = new EventEmitter<boolean>();
    private subscription!: Subscription;
    constructor(private fb: FormBuilder) {}
    
    ngOnInit() {
        if (this.question?.optionList?.optionValues){
            if (this.subscription) {
                this.subscription.unsubscribe();
            }
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
            this.selectedOption = this.fb.control({value:
                this.question.optionList.optionValues.find(
                    option => option.idx.toString() === answer), disabled: this.instance?.completed != null},
                    this.question?.required ? [Validators.required] : []
            );
            //this.validationChange.emit(this.selectedOption.valid);
            this.subscription = this.selectedOption.valueChanges.subscribe(value => {
                this.validationChange.emit(this.selectedOption.valid);
                
                console.log("value:::" + value);
                if(this.instance && this.question?.answers && this.selectedOption.valid) {
                    this.question.answers[0] = {
                        instanceId: this.instance?.instanceId,
                        questionId: this.question?.id,
                        idx : 0,
                        value : value.toString()
                    };
                }
                if (this.question) {
                    this.question.updated = true;
                }
            });
            this.selectedOption.markAllAsTouched();
            

            

        
           /* if (answer) {
                this.selectedOption = this.question.optionList.optionValues.find(
                    option => option.idx.toString() === answer);
            }*/
            console.log(this.comboForm.value);
            console.log(this.question.optionList.optionValues);
         
            
        }
    }
    
}