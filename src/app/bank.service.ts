import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Observer, Subject, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { Account } from 'src/app/models/accounts/account';
import { Transaction } from 'src/app/models/accounts/transaction';

import { TokenService } from 'src/app/auth/token.service';

@Injectable({
    providedIn: 'root'
})
export class BankService {

    private accountsBaseUrl = 'https://vm-bank-api.herokuapp.com/accounts';
    private transactionsBaseUrl = 'https://vm-bank-api.herokuapp.com/transactions';

    constructor(private http: HttpClient, private token: TokenService) { }

    deposit(amount : number) : Observable<Account> {
        const payload = { amount };
        return new Observable<Account>((observer: Observer<Account>) => {
            this.http.post<any>(`${this.accountsBaseUrl}/deposit`, payload).pipe(
                retry(3),
                catchError(this.handleError)
            ).subscribe({
                next: (data: any) => {
                    console.log(`BankService.deposit: data => ${JSON.stringify(data)}`);
                    const account: Account = Account.fromObject(data);
                    console.log(`BankService.deposit: account => ${JSON.stringify(account)}`);
                    observer.next(account);
                    observer.complete();
                },
                error: (error: any) => {
                    console.error(`BankService.deposit: error => ${JSON.stringify(error)}`);
                    observer.error(error);
                }
            })
        });
    }

    withdraw(amount : number) : Observable<Account> {
        const payload = { amount };
        return new Observable<Account>((observer: Observer<Account>) => {
            this.http.post<any>(`${this.accountsBaseUrl}/withdraw`, payload).pipe(
                retry(3),
                catchError(this.handleError)
            ).subscribe({
                next: (data: any) => {
                    console.log(`BankService.withdraw: data => ${JSON.stringify(data)}`);
                    const account: Account = Account.fromObject(data);
                    console.log(`BankService.withdraw: account => ${JSON.stringify(account)}`);
                    observer.next(account);
                    observer.complete();
                },
                error: (error: any) => {
                    console.error(`BankService.withdraw: error => ${JSON.stringify(error)}`);
                    observer.error(error);
                }
            })
        });
    }

    // getAccount(): Observable<Account> {
    //     return new Observable<Account>((observer: Observer<Account>) => {
    //         this.http.get<any>(encodeURI(this.accountsBaseUrl)).pipe(
    //             retry(3),
    //             catchError(this.handleError)
    //         ).subscribe({
    //             next: (data: any) => {
    //                 console.log(`BankService.getAccount: data => ${JSON.stringify(data)}`);
    //                 const account: Account = Account.fromObject(data);
    //                 console.log(`BankService.getAccount: account => ${JSON.stringify(account)}`);
    //                 observer.next(account);
    //                 observer.complete();
    //             },
    //             error: (error: any) => {
    //                 console.error(`BankService.getAccount: error => ${JSON.stringify(error)}`);
    //                 observer.error(error);
    //             }
    //         })
    //     });
    // }

    getAccount(): Observable<Account> {
        return new Observable<Account>((observer: Observer<Account>) => {
            const tokenVal = this.token.getToken();
            console.log(`BankService.getAccount: tokenVal => ${tokenVal}`);
            const httpOptions = {
                headers: new HttpHeaders({
                    'Authorization': 'Bearer ' + tokenVal
                })
            };
            this.http.get<any>(encodeURI(this.accountsBaseUrl), httpOptions).pipe(
                retry(3),
                catchError(this.handleError)
            ).subscribe({
                next: (data: any) => {
                    console.log(`BankService.getAccount: data => ${JSON.stringify(data)}`);
                    const account: Account = Account.fromObject(data);
                    console.log(`BankService.getAccount: account => ${JSON.stringify(account)}`);
                    observer.next(account);
                    observer.complete();
                },
                error: (error: any) => {
                    console.error(`BankService.getAccount: error => ${JSON.stringify(error)}`);
                    observer.error(error);
                }
            })
        });
    }

    getTransactions(): Observable<Transaction[]> {
        return new Observable<Transaction[]>((observer: Observer<Transaction[]>) => {
            this.http.get<any>(encodeURI(this.transactionsBaseUrl)).pipe(
                retry(3),
                catchError(this.handleError)
            ).subscribe({
                next: (data: any) => {
                    console.log(`BankService.getTransactions: data => ${JSON.stringify(data)}`);
                    const transactions: Transaction[] = data.map((value: any) => Transaction.fromObject(value));
                    console.log(`BankService.getTransactions: transactions => ${JSON.stringify(transactions)}`);
                    observer.next(transactions);
                    observer.complete();
                },
                error: (error: any) => {
                    console.error(`BankService.getTransactions: error => ${JSON.stringify(error)}`);
                    observer.error(error);
                }
            })
        });
    }

    private handleError(error: HttpErrorResponse) {
        console.log(`BankService.handleError: error => ${JSON.stringify(error)}`);
        return throwError(() => error);
    }
}