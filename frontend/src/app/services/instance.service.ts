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
        return this.http.get<any>(`${this.baseUrl}api/instance/${id}`,{
         /*   params: {
                readOnly: readOnly.toString() 
            }*/
        }).pipe(
            map(res => plainToInstance(InstanceWithFormDetailed, res))
        );
    }

    addNewInstance(instance: InstanceWithFormDetailed): Observable<boolean> {
        return this.http.post<boolean>(`${this.baseUrl}api/instance`, instance).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
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
    public addGuestAnswer(a: Answer[]): Observable<boolean> {
        return this.http.post<Answer[]>(`${this.baseUrl}api/guestForms`, a).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        )
    }

    deleteInstances(instanceIds: number | number[]): Observable<boolean> {
        const ids = Array.isArray(instanceIds) ? instanceIds : [instanceIds];
        const params = ids.map(id => `ids=${id}`).join('&'); // Convertir en query params
        return this.http.delete<boolean>(`${this.baseUrl}api/instance?${params}` ).pipe(
            map(res => true),
            catchError(err => {
                console.log(err);
                return of(false);
            })
        );
    }
}