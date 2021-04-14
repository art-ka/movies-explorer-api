const Movie = require('../models/movie');
const { NotFound, BadRequest, ForbiddenError } = require('../errors');

const getMovie = (req, res, next) => {
  Movie.find({})
    .then((movie) => res.status(200).send(movie))
    .catch((err) => next(err));
};

const createMovie = (req, res, next) => {
  const { body } = req;
  const { _id } = req.user;
  Movie.countDocuments({})
    .then((count) => Movie.create({ ...body, id: count, owner: _id }))
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Произошла ошибка валидации'));
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  const owner = req.user._id;
  console.log(req.params);
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFound('Фильм не найден');
      }
      if (movie.owner.toString() !== owner) {
        throw new ForbiddenError('Нельзя удалить чужой фильм');
      }
      movie.remove()
        .then(() => res.status(200).send({ message: 'Фильм удален' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Произошла ошибка валидации'));
      }
      return next(err);
    });
};

module.exports = {
  getMovie, createMovie, deleteMovie,
};
