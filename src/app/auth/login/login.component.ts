import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/models/users/user';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    @ViewChild(AlertComponent)
    private alertComponent: AlertComponent | undefined;

    loginForm: FormGroup;

    hide: boolean = true;

    isSaving: boolean = false;

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
        this.isSaving = true;
        this.authService.login(this.phone?.value, this.password?.value).pipe(finalize(() => this.isSaving = false))
        .subscribe({
            next: (user: User) => {
                if (this.authService.isLoggedIn) {
                    this.snackbarService.open(`Login succeeded!`);
                    let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/home';
                    this.router.navigate([redirect]);
                }
            },
            error: (error: any) => {
                console.error(`LoginComponent.onSubmit: error => ${JSON.stringify(error)}`);
                let msg: string = "Something went wrong; please try again later.";
                if (error.error instanceof ErrorEvent) {
                    // A client-side or network error occurred. Handle it accordingly.
                    msg = error.error.message;
                } else {
                    // The backend returned an unsuccessful response code.
                    // The response body may contain clues as to what went wrong.
                    if (error.status === 0) {
                        msg = `Internet connection not found!`;
                    } else if (error.status === 400) {
                        msg = error.error.error.message;
                    } else if (error.status === 404) {
                        msg = error.error.error.message;
                    } else {
                        msg = `${error.status}:${error.statusText}`;
                        if (error.error.error) {
                            msg = `${msg} => ${error.error.error.code}:${error.error.error.message}`;
                        }
                    }
                }
                console.error(`LoginComponent.onSubmit: msg => ${msg}`);
                this.snackbarService.open(msg);
            }
        });
    }
}