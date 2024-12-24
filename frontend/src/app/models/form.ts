import { Instance } from "./instance";
import { Question, QuestionWithAnswers } from "./question";
import { User } from "./user";

export enum State {
    Soumited = 2,
    InProgress = 1,
    NotStarted = 0

}

export class Form {
    lastInstance?: Instance;
    isInstancied: boolean = false;
    owner: User = null!
    ownerFullName: string = '';
    formId: number = 0;
    ownerId: number = 0;
    title: string = '';
    description: string = '';
    isPublic: boolean = false;
    questionsWithAnswers: QuestionWithAnswers[] = [];
    questions: Question[] = []
}

/*export class FormDetailed extends Form {
    questions: QuestionWithAnswers[] = [];
}
export class FormWithQuestions extends Form {
    questions: Question[] = []
}*/