import {User} from "./user";

export enum AccessType {
    User= 0, Editor = 1
}
export class FormAccesses {
    formId: number = 0;
    userId: number = 0;
    user?: User;
    accessType: AccessType = 0;
}