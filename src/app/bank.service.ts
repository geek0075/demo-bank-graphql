import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Observer, Subject, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { Account } from 'src/app/models/accounts/account';
import { Transaction } from 'src/app/models/accounts/transaction';

import { TokenService } from 'src/app/auth/token.service';
import { Apollo, gql } from 'apollo-angular';

const GET_ACCOUNT = gql`
    query GetAccount {
        account {
            balance
            transactions {
                _id
                accountNo
                type
                date
                amount
                balance
            }
        }
    }
`;

const DEPOSIT_ACCOUNT = gql`
    mutation DepositAccount($transactAccountInput: TransactAccountInput!) {
        depositAccount(transactAccountInput: $transactAccountInput) {
            balance
            transactions {
                _id
                accountNo
                type
                date
                amount
                balance
            }
        }
    }
`;

const WITHDRAW_ACCOUNT = gql`
    mutation WithdrawAccount($transactAccountInput: TransactAccountInput!) {
        withdrawAccount(transactAccountInput: $transactAccountInput) {
            balance
            transactions {
                _id
                accountNo
                type
                date
                amount
                balance
            }
        }
    }
`;

@Injectable({
    providedIn: 'root'
})
export class BankService {

    constructor(
        private token: TokenService,
        private apollo: Apollo,
    ) { }

    deposit(amount : number) : Observable<any> {
        return new Observable<any>((observer: Observer<any>) => {
            this.apollo.mutate({
                mutation: DEPOSIT_ACCOUNT,
                variables: {
                    transactAccountInput: {
                        amount: amount,
                    }
                }
            }).subscribe({
                next: (result: any) => {
                    observer.next(result);
                },
                error: (error: any) => {
                    console.error(`BankService.deposit: error => ${JSON.stringify(error)}`);
                    observer.error(error);
                },
                complete: () => {
                    observer.complete();
                }
            })
        });
    }

    withdraw(amount : number) : Observable<any> {
        return new Observable<any>((observer: Observer<any>) => {
            this.apollo.mutate({
                mutation: WITHDRAW_ACCOUNT,
                variables: {
                    transactAccountInput: {
                        amount: amount,
                    }
                }
            }).subscribe({
                next: (result: any) => {
                    observer.next(result);
                },
                error: (error: any) => {
                    console.error(`BankService.withdraw: error => ${JSON.stringify(error)}`);
                    observer.error(error);
                },
                complete: () => {
                    observer.complete();
                }
            })
        });
    }

    getAccount(): Observable<any> {
        return new Observable<any>((observer: Observer<any>) => {
            this.apollo.query({
                query: GET_ACCOUNT,
                fetchPolicy: 'network-only',
            }).subscribe({
                next: (result: any) => {
                    observer.next(result);
                },
                error: (error: any) => {
                    console.error(`BankService.getAccount: error => ${JSON.stringify(error)}`);
                    observer.error(error);
                },
                complete: () => {
                    observer.complete();
                }
            })
        });
    }

    private handleError(error: HttpErrorResponse) {
        console.log(`BankService.handleError: error => ${JSON.stringify(error)}`);
        return throwError(() => error);
    }
}