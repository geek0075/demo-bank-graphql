import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { TokenService } from '../auth/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private token: TokenService) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        // Get the auth token from the service.
        const authToken = this.token.getToken() || '';
        // console.log(`AuthIntercepter.intercept: authToken => ${authToken}`);
        // Clone the request and set the new header in one step.
        const authReq = request.clone({ setHeaders: { Authorization: `Bearer ${authToken}` } });
        // send cloned request with header to the next handler.
        return next.handle(authReq);
    }
}