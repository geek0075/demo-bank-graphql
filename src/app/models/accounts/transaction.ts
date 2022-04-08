export class Transaction {
    _id: string;
    accountNo: string;
    type: string;
    date: Date;
    amount: number;
    balance: number;
   
    constructor(options: {
        id?: string, 
        accountNo?: string, 
        type?: string, 
        date?: Date,
        amount?: number,
        balance?: number,
    }={}) {
        this._id = options.id || '';
        this.accountNo = options.accountNo || '';
        this.type = options.type || '';
        this.date = options.date || new Date();
        this.amount = options.amount || 0;
        this.balance = options.balance || 0;
    }

    static fromObject(obj: any): Transaction {
        return new Transaction({
            id: obj._id, 
            accountNo: obj.accountNo, 
            type: obj.type, 
            date: obj.date, 
            amount: obj.amount,
            balance: obj.balance,
        });
    }

    logConsole() {
        console.log(`Transaction: ${JSON.stringify(this)}`);
    } 
}