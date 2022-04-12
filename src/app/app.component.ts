import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from './auth/auth.service';
import { User } from './models/users/user';

import { SnackbarService } from './shared/snackbar.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

    title = 'Veegil Bank GraphQL';

    private userSubscription: Subscription | undefined;
    public user: User|null = null;

    constructor(
        private authService: AuthService,
        private snackBarService: SnackbarService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.snackBarService.open(`${this.title} loaded successfully!`);
        // update this.user after login/register/logout
        this.userSubscription = this.authService.userSource$.subscribe((user: User|null) => {
            this.user = user;
        });
    }

    ngOnDestroy(): void {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }
}