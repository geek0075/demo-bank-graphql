import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    @ViewChild(AlertComponent)
    private alertComponent: AlertComponent | undefined;

    registerForm: FormGroup;

    hide: boolean = true;

    isSaving: boolean = false;

    constructor(
        public authService: AuthService,
        private snackbarService: SnackbarService,
        public router: Router,
    ) {
        this.registerForm = new FormGroup({
            fullName: new FormControl('', {
                validators: [Validators.required, Validators.maxLength(50)],
                updateOn: 'blur'
            }),
            phone: new FormControl('', {
                validators: [Validators.required, Validators.maxLength(15)],
                updateOn: 'blur'
            }),
            password: new FormControl('', {
              validators: [Validators.required, Validators.maxLength(50)],
              updateOn: 'blur'
            }),
        });
    }

    get fullName() { return this.registerForm.get('fullName'); }
    get phone() { return this.registerForm.get('phone'); }
    get password() { return this.registerForm.get('password'); }

    ngOnInit(): void {
    }

    onSubmit() {
        this.isSaving = true;
        this.authService.register(this.fullName?.value, this.phone?.value, this.password?.value).pipe(finalize(() => this.isSaving = false))
        .subscribe({
            next: (data: any) => {
                this.snackbarService.open(`Register succeeded!`);
                let redirect = '/login';
                this.router.navigate([redirect]);
            },
            error: (error: any) => {
                console.error(`RegisterComponent.onSubmit: error => ${JSON.stringify(error)}`);
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
                    } else {
                        msg = `${error.status}:${error.statusText}`;
                        if (error.error.error) {
                            msg = `${msg} => ${error.error.error.code}:${error.error.error.message}`;
                        }
                    }
                }
                console.error(`RegisterComponent.onSubmit: msg => ${msg}`);
                this.snackbarService.open(msg);
            }
        });
    }
}