require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const {
  PORT, routesNotFoundMessage, mongoServerPath, mongoConnectionSettings, defaultMessageError,
} = require('./utils/constant');
const NotFoundError = require('./errors/not-found-err');

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(mongoServerPath, mongoConnectionSettings);
app.use(cors({
  origin: 'https://best-movies.nomoredomains.monster',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Authoriztion', 'Content-Type', 'Accept', 'Accept-Encoding'],
  credentials: true,
  optionsSuccessStatus: 200,
}));

app.use(requestLogger);

app.use(require('./routes/signin'));
app.use(require('./routes/signup'));

app.use(require('./middlewares/auth'));
app.use(require('./routes/signout'));
app.use(require('./routes/users'));
app.use(require('./routes/movies'));

app.use('/', (req, res) => {
  throw new NotFoundError(routesNotFoundMessage);
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? defaultMessageError : message });
});

app.listen(PORT, () => {
  console.log(`Работает на порте ${PORT}`);
});
