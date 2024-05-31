export default class ExpressError extends Error {
    statusCode: any;
    constructor(message: string, statusCode: number) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

