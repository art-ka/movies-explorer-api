const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    select: false,
  },
});

function findUserByCredentials(email, password) {
  // попытаемся найти пользовател по почте
  const errorMessage = 'Неправильные почта или пароль';

  return this.findOne({ email }).select('+password') // this — это модель User
    .then((user) => {
      // не нашёлся — отклоняем промис
      if (!user) {
        console.log(`User not found, rejecting with: ${errorMessage}`);
        return Promise.reject(new Error(errorMessage));
      }

      // нашёлся — сравниваем хеши
      console.log(`User found: ${user.name}`);
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            console.log(`Hash doesn't match, rejecting with: ${errorMessage}`);
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          console.log(`Password matches for user: ${user.name}`);
          return user;
        });
    });
}

userSchema.statics.findUserByCredentials = findUserByCredentials();

module.exports = mongoose.model('user', userSchema);
