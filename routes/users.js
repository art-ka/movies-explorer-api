const { celebrate, Joi } = require('celebrate');
const routerUser = require('express').Router();
const {
  updateUser, getCurrentUser,
} = require('../controllers/users');

// возвращает информацию о пользователе (email и имя)
routerUser.get('/me', getCurrentUser);

// обновляет информацию о пользователе (email и имя)
routerUser.patch('/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required().min(100),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().min(3).email(),
  }).unknown(true),
}), updateUser);
