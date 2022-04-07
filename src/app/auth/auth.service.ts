import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable, Observer, Subject, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';

import { User } from '../models/users/user';
import { TokenService } from './token.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private baseUrl = 'https://vm-bank-api.herokuapp.com/auth';
    userSource$ = new Subject<User | null>();
    user: User | null = null;
    isLoggedIn = false;
    // store the URL so we can redirect after logging in
    redirectUrl: string = '';

    constructor(
        private http: HttpClient,
        private token: TokenService
    ) { }

    register(fullName : string, phone : string, password : string) : Observable <any> {
        const payload = {
            fullName,
            phone,
            password
        };
        return new Observable<any>((observer: Observer<any>) => {
            this.http.post<any>(`${this.baseUrl}/register`, payload).pipe(
                retry(3), // retry a failed request up to 3 times
                catchError(this.handleError) // then handle the error
            ).subscribe({
                next: (data: any) => {
                    console.log(`AuthService.register: data => ${JSON.stringify(data)}`); // *take out after beta!
                    //const user: User = User.fromObject(data);
                    //console.log(`AuthService.register: user => ${JSON.stringify(user)}`); // *take out after beta!
                    //this.isLoggedIn = true;
                    //this.setUser(user);
                    //this.token.saveToken(user.token);
                    observer.next(data);
                    observer.complete();
                },
                error: (error: any) => {
                    console.error(`AuthService.register: error => ${JSON.stringify(error)}`); // *take out after beta!
                    observer.error(error);
                }
            })
        });
    }

    login(phone : string, password : string) : Observable <User> {
        const payload = {
            phone,
            password
        };
        return new Observable<User>((observer: Observer<User>) => {
            this.http.post<any>(`${this.baseUrl}/login`, payload).pipe(
                retry(3), // retry a failed request up to 3 times
                catchError(this.handleError) // then handle the error
            ).subscribe({
                next: (data: any) => {
                    console.log(`AuthService.login: data => ${JSON.stringify(data)}`); // *take out after beta!
                    const user: User = User.fromObject(data);
                    console.log(`AuthService.login: user => ${JSON.stringify(user)}`); // *take out after beta!
                    this.isLoggedIn = true;
                    this.setUser(user);
                    this.token.saveToken(user.token);
                    observer.next(user);
                    observer.complete();
                },
                error: (error: any) => {
                    console.error(`AuthService.login: error => ${JSON.stringify(error)}`); // *take out after beta!
                    observer.error(error);
                }
            })
        });
    }

    setUser(user: User | null): void {
        this.userSource$.next(user);
        this.user = user;
        (<any>window).user = user;
    }

    getUser(): Observable<User | null> {
        return this.userSource$.asObservable();
    }

    signOut(): void {
        this.token.signOut();
        this.setUser(null);
        this.isLoggedIn = false;
        delete (<any>window).user;
    }

    private handleError(error: HttpErrorResponse) {
        console.log(`AuthService.handleError: error => ${JSON.stringify(error)}`); // *take out after beta!
        return throwError(() => error);
    }
}