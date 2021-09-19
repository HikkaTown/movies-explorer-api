const validator = require('validator');

const { PORT = 3000 } = process.env;
const movieNotFoundMessage = 'Запрашиваемый фильм не найден';
const defaultMessageError = 'Произошла ошибка';
const userNotFoundMessage = 'Запрашиваемый пользователь не найден';
const incorrectDataMessage = 'Переданы неверные данные';
const routesNotFoundMessage = 'Данный маршрут отсутствует';
const emailAlreadyExsist = 'Email принадлежит другому пользователю';
const userAlreadyExsist = 'Пользователь уже существует';
const dataAlreadyExsist = 'Принадлежит другому пользователю';
const logoutMessage = 'Успешно вышли с аккаунта';
const VALIDATION_ERROR_CODE = 'ValidationError';
const CASTERROR_CODE = 'CastError';
const mongoServerPath = 'mongodb://localhost:27017/bitfilmsdb';
const mongoConnectionSettings = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const validationURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.message(incorrectDataMessage);
};

module.exports = {
  PORT,
  VALIDATION_ERROR_CODE,
  CASTERROR_CODE,
  movieNotFoundMessage,
  defaultMessageError,
  userNotFoundMessage,
  routesNotFoundMessage,
  incorrectDataMessage,
  mongoServerPath,
  mongoConnectionSettings,
  emailAlreadyExsist,
  userAlreadyExsist,
  dataAlreadyExsist,
  validationURL,
  logoutMessage,
};
