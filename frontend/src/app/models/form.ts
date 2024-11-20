import { Instance } from "./instance";

export class Form {
    lastInstance: Instance = null!;
    ownerFirstName: string = '';
    ownerLastName: string= '';
    ownerEmail: string= '';
    formId: number = 0;
    title: string = '';
    description: string = '';
    ownerId: number = 0;
    ownerName: string = '';
    isPublic: boolean = false;
   

}