import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Question } from "src/app/models/question";
import { QuestionType } from "src/app/models/question";
import { MatIconModule } from "@angular/material/icon";
import { MatDialog } from "@angular/material/dialog";
import { DeleteQuestionDialog } from "./dialogs/deleteQuestionDialog.component";

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
    @Input() size: number = 0;
    @Input() index: number = 0;
    @Input() isInstancied: boolean = false;
    @Output() askDeleteQuestion: EventEmitter<void> = new EventEmitter<void>
    @Output() askUpward: EventEmitter<void> = new EventEmitter<void>
    @Output() askDownward: EventEmitter<void> = new EventEmitter<void>
   
    public QuestionType = QuestionType;
    constructor(public confirmDialog: MatDialog) {
      
    }
    ngOnInit(): void {
        if (this.question) {
        console.log("idx:   " + this.question.idx);
        }
    }

    deleteQuestion() {
        this.askDeleteQuestion.emit();
        console.log("emit");

    }

    openDialog() {
        this.confirmDialog.open(DeleteQuestionDialog, {
            data: {questionTitle: this.question?.title}}).afterClosed().subscribe((result) => {
            if (result) {
                this.askDeleteQuestion.emit();
            }
        });
    }

    askUpWard() {
        this.askUpward.emit();      
        console.log("emit up");
    }
    askDownWard() {
        this.askDownward.emit();
        console.log("emit down");
    }
}