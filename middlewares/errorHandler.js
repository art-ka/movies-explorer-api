const errorHandler = (err, req, res, next) => {
  console.log(err);

  if (err.status) {
    return res.status(err.status).send({ message: err.message });
  }
  res.status(500).message({ message: err.message });
  return next();
};

module.exports = errorHandler;
