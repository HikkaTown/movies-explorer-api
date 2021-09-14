/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const userRouters = require('./routes/users');
const movieRouters = require('./routes/movies');
const { login, createUser } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const {
  PORT, routesNotFoundMessage, mongoServerPath, mongoConnectionSettings,
} = require('./utils/constant');
const NotFoundError = require('./errors/not-found-err');

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(mongoServerPath, mongoConnectionSettings);

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.post('/signout', auth, (req, res, next) => {
  res.clearCookie('jwt');
  res.status(200).send({ message: 'Успешно вышли с аккаунта' });
  res.end();
});

app.use('/users', auth, userRouters);
app.use('/movies', auth, movieRouters);

app.use('/', auth, (req, res) => {
  throw new NotFoundError(routesNotFoundMessage);
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
});

app.listen(PORT, () => {
  console.log(`Работает на порте ${PORT}`);
});
