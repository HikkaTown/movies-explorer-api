const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const IncorrectDataError = require('../errors/incorrect-data-err');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate(v) {
      return validator.isEmail(v);
    },
  },
  password: {
    type: String,
    require: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    require: true,
    maxlength: 30,
  },
}, {
  versionKey: false,
});

function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
}

userSchema.methods.toJSON = toJSON;

userSchema.statics.findUserByCredentials = function findUsers(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        // юзер не найден
        throw new IncorrectDataError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // хеш не совпали
            throw new IncorrectDataError('Неправильные почта или пароль');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
