import { Instance } from "./instance";
import { Question } from "./question";
import { User } from "./user";

export class Form {
    lastInstance: Instance = null!;
    owner: User = null!
    formId: number = 0;
    title: string = '';
    description: string = '';
    isPublic: boolean = false;
}

export class formDetailed extends Form {
    questions: Question[] = [];
}