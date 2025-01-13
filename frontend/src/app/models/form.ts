import {Instance, InstanceWithUserDetailed} from "./instance";
import { Question } from "./question";
import { User } from "./user";
import {FormArray} from "@angular/forms";
import {FormAccesses} from "./formAccesses";

export enum State {
    Soumited = 2,
    InProgress = 1,
    NotStarted = 0

}

export class Form {
    lastInstance?: Instance;
    isInstancied: boolean = false;
    isEditor: boolean = false;
    owner: User = null!
    ownerFullName: string = '';
    formId: number = 0;
    ownerId: number = 0;
    title: string = '';
    description: string = '';
    isPublic: boolean = false;
    questions: Question[] = [];
    instances: InstanceWithUserDetailed[] = [];
    
}
export class FormWithAccessData extends Form {
    accesses: FormAccesses[] = [];
    allUsersWithoutAdmins: User[] = [];
}

/*export class FormDetailed extends Form {
    questions: QuestionWithAnswers[] = [];
}
export class FormWithQuestions extends Form {
    questions: Question[] = []
}*/