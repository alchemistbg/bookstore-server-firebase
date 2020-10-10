module.exports = class CustomError extends Error {
    constructor({ name, status, code, message }) {
        super();
        this.name = name;
        this.status = status;
        this.code = code;
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
    }
}
