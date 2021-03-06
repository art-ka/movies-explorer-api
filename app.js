require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const routes = require('./routes/index');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { NotFound } = require('./errors');
const limiter = require('./middlewares/limiter');
const { DB_URL } = require('./config/config');

const errorHandler = require('./middlewares/errorHandler');

const { PORT = 3000 } = process.env;

const app = express();
app.use(helmet());

// Массив разешённых доменов
const allowedCors = [
  'https://artmovie.students.nomoredomains.icu',
  'http://www.artmovie.students.nomoredomains.icu',
  'localhost:3001',
];

app.use((req, res, next) => {
  const { origin } = req.headers; // Записываем в переменную origin соответствующий заголовок

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  next();
});

app.use(cors());

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());

app.use(requestLogger); // подключаем логгер запросов
app.use(limiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
  }).unknown(true),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
  }).unknown(true),
}), login);

app.use(auth);
app.use('/users/', auth, routes.routerUser);
app.use('/movies/', auth, routes.routerMovie);

app.use((req, res, next) => {
  next(new NotFound('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use(errorHandler);

app.listen(PORT);
