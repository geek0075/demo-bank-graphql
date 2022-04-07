export class Transaction {
    _id: string;
    accountNo: string;
    type: string;
    date: Date;
    amount: number;
   
    constructor(options: {
        id?: string, 
        accountNo?: string, 
        type?: string, 
        date?: Date,
        amount?: number, 
    }={}) {
        this._id = options.id || '';
        this.accountNo = options.accountNo || '';
        this.type = options.type || '';
        this.date = options.date || new Date();
        this.amount = options.amount || 0;
    }

    static fromObject(obj: any): Transaction {
        return new Transaction({
            id: obj._id, 
            accountNo: obj.accountNo, 
            type: obj.type, 
            date: obj.date, 
            amount: obj.amount
        });
    }

    logConsole() {
        console.log(`Transaction: ${JSON.stringify(this)}`);
    } 
}