import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopnavComponent } from './topnav/topnav.component';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { AlertComponent } from './alert/alert.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        TopnavComponent,
        SnackbarComponent,
        AlertComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        TopnavComponent,
        AlertComponent
    ]
})
export class SharedModule { }