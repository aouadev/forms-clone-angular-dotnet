import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/user';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Instance, InstanceWithFormDetailed } from '../models/instance';
import { Answer } from '../models/answer';

@Injectable({providedIn:'root'})
export class InstanceService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {}
 
    getInstance(id: number, readOnly: boolean) : Observable<InstanceWithFormDetailed> {
        return this.http.get<any>(`${this.baseUrl}api/instance/${id}`, {
            params: {
                readOnly: readOnly.toString() 
            }
        }).pipe(
            map(res => plainToInstance(InstanceWithFormDetailed, res))
        );
    }

    addNewInstance(instance: InstanceWithFormDetailed): Observable<InstanceWithFormDetailed> {
        return this.http.post<InstanceWithFormDetailed>(`${this.baseUrl}api/instance`, instance).pipe(
            map(instance => {
                instance = plainToClass(InstanceWithFormDetailed, instance);
                return instance;
            }
             )
        );
    }

    public addAnswer(a: Answer[]): Observable<boolean> {
        return this.http.post<Answer[]>(`${this.baseUrl}api/answer`, a).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        )
    }
}