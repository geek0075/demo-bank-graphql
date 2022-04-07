import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-snackbar',
    templateUrl: './snackbar.component.html',
    styleUrls: ['./snackbar.component.css']
})
export class SnackbarComponent implements OnInit {

    private _message: string = 'Some text some message..';

    set message(value: string) {
        this._message = value;
    }
    get message(): string {
        return this._message;
    }
    private _showing: boolean = false;
    set showing(value: boolean) {
        this._showing = value;
    }
    get showing(): boolean {
        return this._showing;
    }

    constructor() { }

    ngOnInit(): void { }
}