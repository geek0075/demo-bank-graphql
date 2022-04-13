import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BankService } from 'src/app/bank.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { Account } from 'src/app/models/accounts/account';
import { Transaction } from 'src/app/models/accounts/transaction';

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
                if (!result.loading && result?.data && result?.data?.account) {
                    const account: Account = Account.fromObject(result?.data?.account);
                    const transactions: Transaction[] = result?.data?.account?.transactions.map((value: any) => Transaction.fromObject(value));
                    this.balance = account.balance;
                    this.transactions = transactions;
                }
            },
            error: (error: any) => {
                console.error(`DashboardComponent.onSubmit: error => ${JSON.stringify(error)}`);
                this.snackbarService.open(error.message);
            },
            complete: () => {
            }
        });
    }

    onSubmitDeposit() {
        this.bankService.deposit(this.depositAmount?.value)
        .subscribe({
            next: (result: any) => {
                this.isDepositing = result.loading;
                if (!result.loading && result?.data && result?.data?.depositAccount) {
                    const account: Account = Account.fromObject(result?.data?.depositAccount);
                    const transactions: Transaction[] = result?.data?.depositAccount?.transactions.map((value: any) => Transaction.fromObject(value));
                    this.balance = account.balance;
                    this.transactions = transactions;
                }
            },
            error: (error: any) => {
                console.error(`DashboardComponent.onSubmitDeposit: error => ${JSON.stringify(error)}`);
                this.snackbarService.open(error.message);
            },
            complete: () => {
                this.depositAmount?.reset('');
            }
        });
    }

    onSubmitWithdraw() {
        this.bankService.withdraw(this.withdrawAmount?.value)
        .subscribe({
            next: (result: any) => {
                this.isWithdrawing = result.loading;
                if (!result.loading && result?.data && result?.data?.withdrawAccount) {
                    const account: Account = Account.fromObject(result?.data?.withdrawAccount);
                    const transactions: Transaction[] = result?.data?.withdrawAccount?.transactions.map((value: any) => Transaction.fromObject(value));
                    this.balance = account.balance;
                    this.transactions = transactions;
                }
            },
            error: (error: any) => {
                console.error(`DashboardComponent.onSubmitWithdraw: error => ${JSON.stringify(error)}`);
                this.snackbarService.open(error.message);
            },
            complete: () => {
                this.withdrawAmount?.reset('');
            }
        });
    }
}