import { Injectable } from '@angular/core';

const TOKEN_KEY = 'vm-bank-jwt';

@Injectable()
export class TokenService {

    constructor() { }

    signOut() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.clear();
    }

    public saveToken(token: string) {
        if (!token) return;
        localStorage.removeItem(TOKEN_KEY);
        localStorage.setItem(TOKEN_KEY, token);
    }

    public getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }
}