import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
//import { BankService } from 'src/app/bank.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    balance: number = 0.0;
    balanceLoading: boolean = false;

    depositForm: FormGroup;
    withdrawForm: FormGroup;

    isDepositing: boolean = false;
    isWithdrawing: boolean = false;

    constructor(
        //public bankService: BankService,
        private snackbarService: SnackbarService,
    ) {
        this.depositForm = new FormGroup({
            depositAmount: new FormControl('', {
                validators: [Validators.required, Validators.min(1), Validators.max(50000)],
                updateOn: 'blur'
            }),
        });
        this.withdrawForm = new FormGroup({
            withdrawAmount: new FormControl('', {
                validators: [Validators.required, Validators.min(1), Validators.max(50000)],
                updateOn: 'blur'
            }),
        });
    }

    get depositAmount() { return this.depositForm.get('depositAmount'); }
    get withdrawAmount() { return this.withdrawForm.get('withdrawAmount'); }

    ngOnInit(): void {
    }

    onSubmitDeposit() { }
    onSubmitWithdraw() { }

}