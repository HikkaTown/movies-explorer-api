const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const IncorrectDataError = require('../errors/incorrect-data-err');
const AllreadyExsistError = require('../errors/allready-exsist-err');
const {
  incorrectDataMessage,
  userNotFoundMessage,
  VALIDATION_ERROR_CODE,
  CASTERROR_CODE,
  emailAlreadyExsist,
  userAlreadyExsist,
} = require('../utils/constant');

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(200).send({ data: user.toJSON() }))
    .catch((e) => {
      if (e.name === 'MongoError' || e.code === 11000) {
        const err = new AllreadyExsistError(userAlreadyExsist);
        next(err);
      }
      if (e.name === VALIDATION_ERROR_CODE) {
        const err = new IncorrectDataError(incorrectDataMessage);
        next(err);
      } else {
        next(e);
      }
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user === null) {
        const err = new NotFoundError(userNotFoundMessage);
        next(err);
      }
      res.status(200).send({ data: user });
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

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  if (email) {
    User.findOne({ email })
      .then((user) => {
        if (user === null) {
          return User.findByIdAndUpdate(
            (req.user._id), { name, email },
            { new: true, runValidators: true },
          )
            .then((userData) => {
              if (userData === null) {
                const err = new NotFoundError(userNotFoundMessage);
                next(err);
              } else {
                res.status(200).send({ data: userData });
              }
            });
        }
        const err = new AllreadyExsistError(emailAlreadyExsist);
        next(err);
        return null;
      })
      .catch((e) => {
        if (e.name === VALIDATION_ERROR_CODE || e.name === CASTERROR_CODE) {
          const err = new IncorrectDataError(incorrectDataMessage);
          next(err);
        } else {
          next(e);
        }
      });
  }
  if (!email) {
    User.findByIdAndUpdate((req.user._id), { name, email }, { new: true, runValidators: true })
      .then((user) => {
        if (user === null) {
          const err = new NotFoundError(userNotFoundMessage);
          next(err);
        } else {
          res.status(200).send({ data: user });
        }
      })
      .catch((e) => {
        if (e.name === VALIDATION_ERROR_CODE || e.name === CASTERROR_CODE) {
          const err = new IncorrectDataError(incorrectDataMessage);
          next(err);
        } else {
          next(e);
        }
      });
  }
};

module.exports.login = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true });
      res.status(200).send({ data: user });
    })
    .catch(next);
};
