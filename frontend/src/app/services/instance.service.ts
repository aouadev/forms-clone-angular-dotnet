import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/user';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { Instance, InstanceWithFormDetailed } from '../models/instance';
import { Answer } from '../models/answer';

@Injectable({providedIn:'root'})
export class InstanceService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {}
 
    getInstance(id: number) : Observable<InstanceWithFormDetailed> {
        return this.http.get<any>(`${this.baseUrl}api/instance/${id}`).pipe(
            map(res => plainToInstance(InstanceWithFormDetailed, res))
        );
    }

    public add(a: Answer): Observable<boolean> {
        return this.http.post<Answer>(`${this.baseUrl}api/answer`, a).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        )
    }
}