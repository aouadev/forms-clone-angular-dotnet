import { Injectable, Inject } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import { Form } from '../models/form';
import { User } from '../models/user';
import { catchError, map } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { plainToInstance } from "class-transformer";

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
    getMyForms(id : number): Observable<Form[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/forms/${id}`).pipe( 
            map(res => plainToInstance(Form, res))

        );
    }
}