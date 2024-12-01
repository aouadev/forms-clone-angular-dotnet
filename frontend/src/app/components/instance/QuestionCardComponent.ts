import { Component, Input } from "@angular/core";
import { OptionValue } from "src/app/models/optionValue";
import { Question } from "src/app/models/question";

@Component({
    selector:'question-card',
    templateUrl:'questionCard.component.html',
    styleUrls:[
        'instance.component.css'
    ]
})
export class QuestionCardComponent {
    @Input() questionNumber: number = 0;
    @Input() questions: Question[] = [];
    constructor() {}

    isChecked(idx: number) {
        return this.questions[this.questionNumber].answers.some(answer => Number(answer.value) == idx)
    }

    onCheckboxChange(checked: boolean, idx: number): void {
        const answers = this.questions[this.questionNumber].answers;
        if (checked) {
            // answers.push({ value: idx });
            console.log("answer");
        } else {

          const indexToRemove = answers.findIndex(answer => Number(answer.value) === idx);
          if (indexToRemove > -1) {
            answers.splice(indexToRemove, 1);
          }
        }
      }
      
}
