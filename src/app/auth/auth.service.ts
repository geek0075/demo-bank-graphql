import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable, Observer, Subject, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';

import { User } from '../models/users/user';
import { TokenService } from './token.service';

import { Apollo, gql } from 'apollo-angular';

const LOGIN_USER = gql`
    mutation LoginUser($loginUserInput: LoginUserInput!) {
        loginUser(loginUserInput: $loginUserInput) {
            access_token
        }
    }
`;

const REGISTER_USER = gql`
    mutation registerUser($createUserInput: CreateUserInput!) {
        registerUser(createUserInput: $createUserInput) {
            _id
            fullName
            phone
            account {
                accountNo
                balance
            }
        }
    }
`;

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    userSource$ = new Subject<User | null>();
    user: User | null = null;
    isLoggedIn = false;
    // store the URL so we can redirect after logging in
    redirectUrl: string = '';

    constructor(
        private token: TokenService,
        private apollo: Apollo,
    ) { }

    register(fullName : string, phone : string, password : string) : Observable <any> {
        return new Observable<any>((observer: Observer<any>) => {
            this.apollo.mutate({
                mutation: REGISTER_USER,
                variables: {
                    createUserInput: {
                        fullName: fullName,
                        phone: phone,
                        password: password
                    }
                }
            }).subscribe({
                next: (result: any) => {
                    observer.next(result);
                },
                error: (error: any) => {
                    console.error(`AuthService.register: error => ${JSON.stringify(error)}`);
                    observer.error(error);
                },
                complete: () => {
                    observer.complete();
                }
            })
        });
    }

    login(phone : string, password : string) : Observable <any> {
        return new Observable<any>((observer: Observer<any>) => {
            this.apollo.mutate({
                mutation: LOGIN_USER,
                variables: {
                    loginUserInput: {
                        phone: phone,
                        password: password
                    }
                }
            }).subscribe({
                next: (result: any) => {
                    if (!result.loading && result?.data && result?.data?.loginUser && result?.data?.loginUser?.access_token) {
                        const user: User = User.fromObject(result?.data?.loginUser);
                        this.isLoggedIn = true;
                        this.setUser(user);
                        this.token.saveToken(user.token);
                    }
                    observer.next(result);
                },
                error: (error: any) => {
                    console.error(`AuthService.login: error => ${JSON.stringify(error)}`);
                    observer.error(error);
                },
                complete: () => {
                    observer.complete();
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