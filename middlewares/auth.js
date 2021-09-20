const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const IncorrectDataError = require('../errors/incorrect-data-err');

module.exports = (req, res, next) => {
  const tokenJWT = req.cookies.jwt;
  if (!tokenJWT) {
    throw new IncorrectDataError('Необходима авторизация');
  }
  const token = tokenJWT;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (e) {
    next();
  }
  req.user = payload;
  next();
};
