import { Injectable, Inject } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import { Form} from '../models/form';
import { User } from '../models/user';
import { catchError, map } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { plainToInstance } from "class-transformer";
import { InstanceWithFormDetailed } from "../models/instance";
import { Question } from "../models/question";

@Injectable({ providedIn: 'root'})
export class QuestionService {
    constructor(private http: HttpClient, @Inject('BASE_URL')private baseUrl: string) {

    }

    updateQuestion(question: Question): Observable<boolean> {
        return this.http.put<Question>(`${this.baseUrl}api/question`, question).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }
}