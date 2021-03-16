class ForbiddenError extends Error {
  constructor(message) {
    super();

    this.message = message;
    this.status = 403;
  }
}

module.exports = ForbiddenError;
