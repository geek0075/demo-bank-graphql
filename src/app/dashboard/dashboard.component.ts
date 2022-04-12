import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BankService } from 'src/app/bank.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { Account } from 'src/app/models/accounts/account';
import { Transaction } from 'src/app/models/accounts/transaction';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    balance: number = 0.0;
    balanceLoading: boolean = false;

    transactions: Transaction[] = [];

    depositForm: FormGroup;
    withdrawForm: FormGroup;

    isDepositing: boolean = false;
    isWithdrawing: boolean = false;

    constructor(
        public bankService: BankService,
        private snackbarService: SnackbarService,
    ) {
        this.depositForm = new FormGroup({
            depositAmount: new FormControl('', {
                validators: [Validators.required, Validators.min(1), Validators.max(50000)],
            }),
        });
        this.withdrawForm = new FormGroup({
            withdrawAmount: new FormControl('', {
                validators: [Validators.required, Validators.min(1), Validators.max(50000)],
            }),
        });
    }

    get depositAmount() { return this.depositForm.get('depositAmount'); }
    get withdrawAmount() { return this.withdrawForm.get('withdrawAmount'); }

    ngOnInit(): void {
        this.getAccount();
    }

    getAccount() {
        this.bankService.getAccount()
        .subscribe({
            next: (result: any) => {
                this.balanceLoading = result.loading;
            },
            error: (error: any) => {
                console.error(`DashboardComponent.onSubmit: error => ${JSON.stringify(error)}`);
                this.snackbarService.open(error.message);
            },
            complete: () => {
            }
        });

        // this.balanceLoading = true;
        // this.bankService.getAccount().pipe(finalize(() => this.balanceLoading = false))
        // .subscribe({
        //     next: (account: Account) => {
        //         this.balance = account.balance;
        //     },
        // });
    }

    // getTransactions() {
    //     this.transactionsLoading = true;
    //     this.bankService.getTransactions().pipe(finalize(() => this.transactionsLoading = false))
    //     .subscribe({
    //         next: (transactions: Transaction[]) => {
    //             this.transactions = transactions;
    //         },
    //         error: (error: any) => {
    //             console.error(`DashboardComponent.getTransactions: error => ${JSON.stringify(error)}`);
    //             let msg: string = "Something went wrong; please try again later.";
    //             if (error.error instanceof ErrorEvent) {
    //                 // A client-side or network error occurred. Handle it accordingly.
    //                 msg = error.error.message;
    //             } else {
    //                 // The backend returned an unsuccessful response code.
    //                 // The response body may contain clues as to what went wrong.
    //                 if (error.status === 0) {
    //                     msg = `Internet connection not found!`;
    //                 } else if (error.status === 400) {
    //                     msg = error.error.error.message;
    //                 } else if (error.status === 404) {
    //                     msg = error.error.error.message;
    //                 } else {
    //                     msg = `${error.status}:${error.statusText}`;
    //                     if (error.error.error) {
    //                         msg = `${msg} => ${error.error.error.code}:${error.error.error.message}`;
    //                     }
    //                 }
    //             }
    //             console.error(`DashboardComponent.getTransactions: msg => ${msg}`);
    //             this.snackbarService.open(msg);
    //         }
    //     });
    // }

    onSubmitDeposit() {
        this.bankService.deposit(this.depositAmount?.value)
        .subscribe({
            next: (result: any) => {
                this.isDepositing = result.loading;
            },
            error: (error: any) => {
                console.error(`DashboardComponent.onSubmitDeposit: error => ${JSON.stringify(error)}`);
                this.snackbarService.open(error.message);
            },
            complete: () => {
            }
        });


        // this.isDepositing = true;
        // this.bankService.deposit(this.depositAmount?.value).pipe(finalize(() => this.isDepositing = false))
        // .subscribe({
        //     next: (account: Account) => {
        //         this.balance = account.balance;
        //         this.depositAmount?.reset('');
        //         this.getTransactions();
        //     },
        // });
    }

    onSubmitWithdraw() {
        this.bankService.withdraw(this.withdrawAmount?.value)
        .subscribe({
            next: (result: any) => {
                this.isWithdrawing = result.loading;
            },
            error: (error: any) => {
                console.error(`DashboardComponent.onSubmitWithdraw: error => ${JSON.stringify(error)}`);
                this.snackbarService.open(error.message);
            },
            complete: () => {
            }
        });


        // this.isWithdrawing = true;
        // this.bankService.withdraw(this.withdrawAmount?.value).pipe(finalize(() => this.isWithdrawing = false))
        // .subscribe({
        //     next: (account: Account) => {
        //         this.balance = account.balance;
        //         this.withdrawAmount?.reset('');
        //         this.getTransactions();
        //     },
        // });
    }
}