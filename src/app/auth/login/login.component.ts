import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/models/users/user';
import { SnackbarService } from 'src/app/shared/snackbar.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    @ViewChild(AlertComponent)
    private alertComponent: AlertComponent | undefined;

    loginForm: FormGroup;

    loading: boolean = false;

    constructor(
        public authService: AuthService,
        private snackbarService: SnackbarService,
        public router: Router,
    ) {
        this.loginForm = new FormGroup({
            phone: new FormControl('', {
                validators: [Validators.required],
                updateOn: 'blur'
            }),
            password: new FormControl(''),
        });
    }

    get phone() { return this.loginForm.get('phone'); }
    get password() { return this.loginForm.get('password'); }

    ngOnInit(): void {
    }

    onSubmit() {
        this.authService.login(this.phone?.value, this.password?.value)
        .subscribe({
            next: (result: any) => {
                this.loading = result.loading;
            },
            error: (error: any) => {
                console.error(`LoginComponent.onSubmit: error => ${JSON.stringify(error)}`);
                this.snackbarService.open(error.message);
            },
            complete: () => {
                if (this.authService.isLoggedIn) {
                    this.snackbarService.open(`Login succeeded!`);
                    let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/home';
                    this.router.navigate([redirect]);
                }
            }
        });
    }
}