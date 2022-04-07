import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/users/user';

import { Observable, Subscription, map } from 'rxjs';

@Component({
    selector: 'app-topnav',
    templateUrl: './topnav.component.html',
    styleUrls: ['./topnav.component.css']
})
export class TopnavComponent implements OnInit, OnDestroy {

    @Input() user: User|null = null;
    isLogin: boolean = true;
    isRegister: boolean = true;
    private routerEventsSubscription: Subscription | undefined

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnDestroy(): void {
        if (this.routerEventsSubscription) {
            this.routerEventsSubscription.unsubscribe();
        }
    }

    ngOnInit(): void {
        this.routerEventsSubscription = this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationStart) {
                console.log('TopnavComponent.ngOnInit.NavigationStart');
            }
            if (event instanceof NavigationEnd) {
                console.log(`TopnavComponent.ngOnInit.NavigationEnd: event.url => ${event.url}, event => ${JSON.stringify(event)}`);
                if (event.url === '/login') {
                    this.isLogin = true;
                    this.isRegister = false;
                } else if (event.url === '/register') {
                    this.isLogin = false;
                    this.isRegister = true;
                } else {
                    this.isLogin = true;
                    this.isRegister = true;
                }
            }
            if (event instanceof NavigationError) {
                console.log(`TopnavComponent.ngOnInit.NavigationError: event.error => ${event.error}, event => ${JSON.stringify(event)}`);
            }
        });
    }

    logout(): void {
        this.authService.signOut();
        this.router.navigate(['/']);
    }

    gotoLogin(): void {
        this.router.navigate(['/login']);
    }

    gotoRegister(): void {
        this.router.navigate(['/register']);
    }
}