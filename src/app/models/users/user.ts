export class User {
    token: string;

    constructor(options: {
        token?: string
    }={}) {
        this.token = options.token || '';
    }

    static fromObject(obj: any): User {
        return new User({
            token: obj.access_token
        });
    }

    logConsole() {
        console.log(`User: ${JSON.stringify(this)}`);
    } 
}