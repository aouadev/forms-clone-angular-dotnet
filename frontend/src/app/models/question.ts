import {Answer} from "./answer";
import { OptionList } from "./optionList";

export enum QuestionType {
    Short = 1, Long = 2, Date = 3, Email = 4, Integer = 5, Check = 6, Combo = 7, Radio = 8
}
export class Question {
    id: number = 0;
    formId: number = 0;
    idx: number = 0;
    title: string = '';
    description?: string;
    type: QuestionType = QuestionType.Short;
    required: boolean = false;
    updated: boolean = false;
    isValid: boolean = false;
    optionListId?: number;
    optionList?: OptionList;
    answers: Answer[] = [];
}

/*export class QuestionWithAnswers extends Question{
    
}*/