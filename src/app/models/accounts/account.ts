export class Account {
    _id: string;
    accountNo: string;
    balance: number;

    constructor(options: {
        id?: string,
        accountNo?: string,
        balance?: number
    }={}) {
        this._id = options.id || '';
        this.accountNo = options.accountNo || '';
        this.balance = options.balance || 0;
    }

    static fromObject(obj: any): Account {
        return new Account({
            id: obj._id,
            accountNo: obj.accountNo,
            balance: obj.balance
        });
    }

    logConsole() {
        console.log(`Account: ${JSON.stringify(this)}`);
    } 
}