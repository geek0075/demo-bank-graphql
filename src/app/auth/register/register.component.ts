import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    @ViewChild(AlertComponent)
    private alertComponent: AlertComponent | undefined;

    registerForm: FormGroup;

    loading: boolean = false;

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
        this.authService.register(this.fullName?.value, this.phone?.value, this.password?.value)
        .subscribe({
            next: (result: any) => {
                this.loading = result.loading;
            },
            error: (error: any) => {
                console.error(`RegisterComponent.onSubmit: error => ${JSON.stringify(error)}`);
                this.snackbarService.open(error.message);
            },
            complete: () => {
                this.snackbarService.open(`Register succeeded!`);
                let redirect = '/login';
                this.router.navigate([redirect]);
            }
        });
    }
}