import {Component, Input, OnInit, SimpleChanges} from "@angular/core";
import {Instance} from "../../../models/instance";
import {Question} from "../../../models/question";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {Q} from "@angular/cdk/keycodes";
import {Option} from "@angular/cli/src/command-builder/utilities/json-schema";

@Component({
    selector: "combo-question",
    templateUrl: "./comboQuestion.component.html",
    styleUrls: ["../instance.component.css"]
})
export class ComboQuestionComponent implements OnInit{
    @Input() question?: Question;
    @Input() instanceId?: number;
    public comboForm!: FormGroup;
    public selectedValue: string = 'No Value';
    private subscription!: Subscription;
    constructor(private fb: FormBuilder) {}
    
    ngOnInit() {
        if (this.question?.optionList?.optionValues) {
            this.comboForm = this.fb.group({
                optionValues: this.fb.array(this.question?.optionList?.optionValues?.map((option) => {
                    this.fb.control({
                        optionIdx: option.idx,
                        label: option.label,
                        selected: this.question?.answers?.some(answer => answer.value === option.idx.toString())
                    });
                }))
            });
            
         
            
        }
    }
    
}