import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

    private _message: string | null = null;
    private _isShowing: boolean = false;

    set message(value: string | null) {
        this._message = value;
    }
  
    get message(): string | null { return this._message; }

    set isShowing(value: boolean) {
        this._isShowing = value;
    }

    get isShowing(): boolean { return this._isShowing; }

    constructor() { }

    ngOnInit() {
    }

    private show(type:string, message:string) {
        const myAlert = document.getElementById("myAlert");
        if (myAlert) {
            myAlert.classList.remove('danger', 'success', 'info', 'warning');
            myAlert.classList.add(type);
            this.message = message;
            if (!myAlert.classList.contains('shown')) {
                myAlert.classList.add('shown');
                this.isShowing = true;
            }
        }
    }

    hide() {
        const myAlert = document.getElementById("myAlert");
        if (myAlert) {
            if (myAlert.classList.contains('shown')) {
                myAlert.classList.remove('shown');
                this.isShowing = false;
            }
        }
    }

    showDanger(message:string) {
        this.show('danger', message);
    }

    showSuccess(message:string) {
        this.show('success', message);
    }

    showInfo(message:string) {
        this.show('info', message);
    }

    showWarning(message:string) {
        this.show('warning', message);
    }
}