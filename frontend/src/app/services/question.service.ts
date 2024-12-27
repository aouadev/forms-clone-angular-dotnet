import { Injectable, Inject } from "@angular/core";
import { HttpClient } from '@angular/common/http';

import { Form} from '../models/form';
import { User } from '../models/user';
import { catchError, map } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { plainToInstance } from "class-transformer";
import { InstanceWithFormDetailed } from "../models/instance";
import { Question } from "../models/question";
import { OptionList } from "../models/optionList";
import { pl, th } from "date-fns/locale";

@Injectable({ providedIn: 'root'})
export class QuestionService {
    constructor(private http: HttpClient, @Inject('BASE_URL')private baseUrl: string) {

    }

    postQuestion(question: Question): Observable<boolean> {
        return this.http.post<boolean>(`${this.baseUrl}api/question`, question).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }
    getOptionLists(id: number): Observable<OptionList[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/optionList/${id}`).pipe(
            map(res => plainToInstance(OptionList, res))
        );
    }

    getMyOptionLists(): Observable<OptionList[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/optionList`).pipe(
            map(res => plainToInstance(OptionList, res))
        );
    }
    getAllQuestion(): Observable<Question[]> {
        return this.http.get<Question[]>(`${this.baseUrl}api/question`).pipe(
            map(res => plainToInstance(Question, res))
        );
    }

    public deleteOptionList(id: number):Observable<boolean> {
        return this.http.delete<boolean>(`${this.baseUrl}api/optionList/${id}`).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }
}