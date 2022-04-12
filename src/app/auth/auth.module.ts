import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';

import { TokenService } from './token.service';

@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
        AccessDeniedComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        AuthRoutingModule,
    ],
    providers: [
        TokenService
    ]
})
export class AuthModule { }