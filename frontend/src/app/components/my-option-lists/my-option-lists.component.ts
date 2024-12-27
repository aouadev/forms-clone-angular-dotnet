import { Component, OnInit } from "@angular/core";
import { OptionList } from "src/app/models/optionList";
import { QuestionService } from "src/app/services/question.service";

@Component({
    selector: 'my-option-lists',
    templateUrl: 'my-option-lists.component.html',
    styleUrl: ''
})
export class MyOptionListComponent implements OnInit{
    public myOptionLists?: OptionList[];

    constructor(private questionService: QuestionService) {

    }

    ngOnInit(): void {
        this.questionService.getMyOptionLists().subscribe(res =>{
            this.myOptionLists = res;
            console.log("res: ", res);
        })
    }
}