import { Component, Input, OnInit } from "@angular/core";
import { Question } from "src/app/models/question";
import { QuestionType } from "src/app/models/question";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: 'view-question-card',
    templateUrl: 'viewQuestionCard.component.html',
    styleUrls: [
         '../view-forms/view-forms.component.css',
        "../instance/instance.component.css",
        "./viewForm.component.css"
    ]
})

export class viewQuestionCard implements OnInit{
    @Input() question?: Question;
    public QuestionType = QuestionType;
    constructor() {
      
    }
    ngOnInit(): void {
        if (this.question) {
        console.log("type:   " + this.question?.getType);
        }
    }
}