import {Type} from "@angular/core";

export enum Role {
    Admin=2,
    User=1,
    Guest=0
}

export class User {
    id: number = 0;
    email?: string = '';
    firstName: string = '';
    lastName: string = '';
    password?: string = '';
    token?: string;
    role?: Role;
    refreshToken?: string;

    toString(): string {
        return this.firstName + " " + this.lastName;
    }
   /* public get roleAsString(): string {
        return Role[this.role];
    }*/
}