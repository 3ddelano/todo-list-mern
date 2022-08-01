class ExtendableError extends Error {
    constructor(message, status, isPublic) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        this.status = status;
        this.isPublic = isPublic;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor.name);
    }
}

class APIError extends ExtendableError {
    constructor(message, status = 500, isPublic = false) {
        super(message, status, isPublic);
    }
}

module.exports = APIError;
