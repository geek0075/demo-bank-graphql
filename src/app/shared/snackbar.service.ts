import { Injectable } from '@angular/core';
import { ApplicationRef, Injector, EmbeddedViewRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { SnackbarComponent } from './snackbar/snackbar.component';

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver, 
        private appRef: ApplicationRef, 
        private injector: Injector
    ) { }

    open(message: string) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(SnackbarComponent);
        const componentRef = componentFactory.create(this.injector);
        const snackBar: SnackbarComponent = (<SnackbarComponent>componentRef.instance);
        snackBar.message = message;
        this.appRef.attachView(componentRef.hostView);
        const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        document.body.appendChild(domElem);
        snackBar.showing = true;
        setTimeout(() => {
            snackBar.showing = false;
            this.appRef.detachView(componentRef.hostView);
            componentRef.destroy();
        }, 3000);
    }
}