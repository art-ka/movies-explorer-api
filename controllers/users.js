const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  NotFound, BadRequest, Unauthorized, ConflictError,
} = require('../errors');

const getCurrentUser = (req, res, next) => {
  console.log(`Looking for user: ${req.user._id}`);
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Такого пользователя не существует');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Произошла ошибка валидации'));
      }
      return next(err);
    });
};

const publicUser = (user) => {
  const {
    name, _id, email,
  } = user;

  return {
    name,
    _id,
    email,
  };
};

const createUser = async (req, res, next) => {
  const { body } = req;
  const unencrypted = body.password;

  const existingUser = await User.findOne({ email: body.email });
  if (existingUser) {
    return next(new ConflictError('Пользователь уже существует'));
  }
  body.password = bcrypt.hashSync(unencrypted, 10);

  return User.countDocuments({})
    .then((count) => User.create({ ...body, id: count }))
    .then((user) => res.status(200).send(publicUser(user)))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Произошла ошибка валидации'));
      }
      return next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new BadRequest('Произошла ошибка валидации'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      // создадим токен
      const { JWT_SECRET } = process.env;
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      console.error(err.message);
      next(new Unauthorized('Неправильный логин или пароль'));
    });
};

module.exports = {
  getCurrentUser, updateUser, createUser, login,
};
