const Unauthorized = require('./Unauthorized');
const NotFound = require('./NotFound');
const BadRequest = require('./BadRequest');
const ConflictError = require('./ConflictError');
const ForbiddenError = require('./ForbiddenError');

module.exports = {
  Unauthorized,
  NotFound,
  BadRequest,
  ConflictError,
  ForbiddenError,
};
