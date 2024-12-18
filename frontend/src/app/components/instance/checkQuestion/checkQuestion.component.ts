import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {Question, QuestionWithAnswers} from "../../../models/question";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {Answer} from "../../../models/answer";
import {plainToClass, plainToInstance} from "class-transformer";
import {th} from "date-fns/locale";
import {F} from "@angular/cdk/keycodes";

@Component({
    selector: "check-question",
    templateUrl: "./checkQuestion.component.html",
    styleUrls: ["../instance.component.css"]
})
export class CheckQuestionComponent implements OnInit, OnChanges  {
    @Input() question?: QuestionWithAnswers;
    @Input() instanceId?: number;
    public comboForm!: FormGroup;
    private answerIndex: number = 0;
  
    private subscription!: Subscription;
    constructor(private fb: FormBuilder) {
      
    }
    ngOnInit() {
        this.comboForm = this.fb.group({
            optionsValues: this.fb.array(this.question?.optionList?.optionValues?.
            map(option => 
                    this.fb.control({
                    optionIdx: option.idx,
                    label: option.label,
                    checked: this.question?.answers?.some(answer => answer.value === option.idx.toString())
                    
                })
            ) || [])
        });
        console.log(this.comboForm.value);
        this.comboForm.valueChanges.subscribe(value => {
            console.log(value);
        })
      
   
        
    }
    ngOnChanges(changes: SimpleChanges): void {
        if(changes['question']) {
            console.log("comboChange");
          
        }
      
    }

  
    
    addCheckedAnswer(checked: boolean, idx: number) {
        
        if(checked && this.question) {
            console.log(this.question.answers.length)
            this.question.answers.push({
                instanceId: this.instanceId || 0,
                questionId: this.question.id,
                idx: this.question.answers.length + 1,
                value: idx.toString()


            });
            this.question.updated = true;
        } else if(!checked && this.question) {
            const indexToRemove = this.question.answers.findIndex(
                                answer => answer.value === idx.toString());
            if (indexToRemove > -1) {
                this.question.answers.splice(indexToRemove, 1);
            }
            
            this.question.updated = true;
        }
        
    }
}