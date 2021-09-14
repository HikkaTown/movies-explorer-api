const { PORT = 3000 } = process.env;
const movieNotFoundMessage = 'Запрашиваемый фильм не найден';
const defaultMessageError = 'Произошла ошибка';
const userNotFoundMessage = 'Запрашиваемый пользователь не найден';
const incorrectDataMessage = 'Переданы неверные данные';
const routesNotFoundMessage = 'Данный маршрут отсутствует';
const VALIDATION_ERROR_CODE = 'ValidationError';
const CASTERROR_CODE = 'CastError';
const mongoServerPath = 'mongodb://localhost:27017/bitfilmsdb';
const mongoConnectionSettings = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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
};
