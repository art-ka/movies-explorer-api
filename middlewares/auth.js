const jwt = require('jsonwebtoken');
const { Unauthorized } = require('../errors');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  if (NODE_ENV !== 'production') {
    req.user = { _id: '6050c31008b95d4cc812be14' };
    return next();
  }

  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть и начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized('Необходима авторизация');
  }
  // извлечём токен
  const token = authorization.replace('Bearer ', '');
  console.log(`Token without Bearer: ${token}`);

  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error(`can't validate token: ${err.message}`);
    throw new Unauthorized('Необходима авторизация');
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
