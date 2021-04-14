const { celebrate, Joi } = require('celebrate');
const routerMovie = require('express').Router();
const {
  getMovie, createMovie, deleteMovie,
} = require('../controllers/movies');

module.exports = routerMovie;

const validateMovieID = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().length(24),
  }).unknown(true),
});

// возвращает все сохранённые пользователем фильмы
routerMovie.get('/', getMovie);

// создаёт фильм с переданными в теле
// country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail
routerMovie.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/),
    trailer: Joi.string().required().regex(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/),
    thumbnail: Joi.string().required().regex(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }).unknown(true),
}), createMovie);

// удаляет сохранённый фильм по _id
routerMovie.delete('/:movieId', validateMovieID, deleteMovie);
