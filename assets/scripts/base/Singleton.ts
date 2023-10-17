export default class Singleton {
    private static _intance: any = null

    static getInstance<T>(): T {
        if (this._intance === null) {
            this._intance = new this()
        }
        return this._intance
    }

}