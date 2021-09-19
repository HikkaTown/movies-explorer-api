const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const IncorrectDataError = require('../errors/incorrect-data-err');
const ForbiddenError = require('../errors/forbidden-err');
const {
  incorrectDataMessage,
  movieNotFoundMessage,
  VALIDATION_ERROR_CODE,
  CASTERROR_CODE,
  dataAlreadyExsist,
} = require('../utils/constant');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(200).send({ data: movies }))
    .catch((e) => {
      if (e.name === VALIDATION_ERROR_CODE) {
        const err = new IncorrectDataError(incorrectDataMessage);
        next(err);
      } else {
        next(e);
      }
    });
};

module.exports.createMovie = (req, res, next) => {
  const userId = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: userId,
  })
    .then((movie) => res.status(200).send({ data: movie }))
    .catch((e) => {
      if (e.name === VALIDATION_ERROR_CODE) {
        const err = new IncorrectDataError(incorrectDataMessage);
        next(err);
      } else {
        next(e);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const userId = req.user._id;
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (movie === null) {
        const err = new NotFoundError(movieNotFoundMessage);
        next(err);
      }
      if (movie.owner.toString() === userId) {
        return Movie.findByIdAndRemove(req.params.movieId)
          .then((removedMovie) => res.status(200).send(removedMovie));
      }
      const err = new ForbiddenError(dataAlreadyExsist);
      next(err);
      return null;
    })
    .catch((e) => {
      if (e.name === CASTERROR_CODE) {
        const err = new IncorrectDataError(incorrectDataMessage);
        next(err);
      } else {
        next(e);
      }
    });
};
