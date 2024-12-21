import { Injectable, Inject } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import { Form, FormDetailed, FormWithQuestions } from '../models/form';
import { User } from '../models/user';
import { catchError, map } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { plainToInstance } from "class-transformer";
import { InstanceWithFormDetailed } from "../models/instance";

@Injectable({ providedIn: 'root'})
export class FormService {
    constructor(private http: HttpClient, @Inject('BASE_URL')private baseUrl: string) {}

    getAll(): Observable<Form[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/forms`).pipe(
            map(res => plainToInstance(Form, res))
        );
    }

    getUser(id : number): Observable<User> {
        return this.http.get<any>(`${this.baseUrl}api/users/${id}`).pipe(
            map(res => plainToInstance(User, res))
        );
    }
    getMyForms(): Observable<Form[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/forms`).pipe( 
            map(res => plainToInstance(Form, res))

        );
    }
    getAllForms(): Observable<Form[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/admin`).pipe( 
            map(res => plainToInstance(Form, res))

        );
    }

    getPublicForms(): Observable<Form[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/guestForm`).pipe(
            map(res => plainToInstance(Form, res))
        );
    }

    getFormWithquestions(id: number): Observable<InstanceWithFormDetailed> {
        return this.http.get<any>(`${this.baseUrl}api/forms/${id}`).pipe(
            map(res => plainToInstance(InstanceWithFormDetailed, res))
        );
    }

    getForm(id: number): Observable<FormWithQuestions> {
        return this.http.get<any>(`${this.baseUrl}api/viewForm/${id}`).pipe(
            map(res => plainToInstance(FormWithQuestions, res))
        );
    }

    public deleteQuestion(id: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.baseUrl}api/viewform/${id}`).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }
}