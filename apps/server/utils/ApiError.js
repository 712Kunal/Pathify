class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wroung",
    details = null,
    isOperational = true,
    stack = "",
    errors = []
  ) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.message = message;
    this.success = false;
    this.errors = errors;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor); // It captures the stack trace (the path of function calls that led to this error) but skips the constructor function itself.
    }
  }
}

export default ApiError;
