import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, mergeMap } from 'rxjs/operators';
import { User } from '../models/user';
import { Role } from '../models/user';
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    // l'utilisateur couramment connecté (undefined sinon)
    public currentUser?: User;
    

    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
        // au départ on récupère un éventuel utilisateur stocké dans le sessionStorage
        let data = sessionStorage.getItem('currentUser');
        if (data)
            data = JSON.parse(data);
        this.currentUser = plainToClass(User, data);
        console.log(data);
    }

    login(email: string, password: string): Observable<User> {
        return this.http.post<any>(`${this.baseUrl}api/users/authenticate`, { email, password })
            .pipe(map(user => {
                user = plainToClass(User, user);
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUser = user;
                }

                return user;
            }));
    }
    loginAsGuest(): User{
        // Créer un utilisateur "virtuel" pour les invités
        const guestUser: User = {
            id: 0, // Utiliser un ID unique pour représenter le guest
            email: 'guest@epfc.eu',
            firstName: '',
            lastName: '',
            role: Role.Guest,
            token: undefined,
            roleAsString: 'guest' // Pas de token pour les invités
        };
        this.currentUser =  guestUser;
        // Stocker les détails dans sessionStorage pour les utiliser plus tard
        sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        // Mettre à jour la propriété currentUser
      
        return guestUser;
        
    }
    

    logout() {
        // remove user from local storage to log user out
        sessionStorage.removeItem('currentUser');
        this.currentUser = undefined;
    }
    
}
