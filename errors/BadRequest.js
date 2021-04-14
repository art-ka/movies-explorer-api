class BadRequest extends Error {
  constructor(message) {
    super();

    this.message = message;
    this.status = 400;
  }
}

module.exports = BadRequest;
