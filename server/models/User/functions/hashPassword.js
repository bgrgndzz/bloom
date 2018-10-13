const bcrypt = require('bcrypt');

module.exports = function(next) {
  if (this.preSave) {
    bcrypt.hash(this.auth.password, 10, (err, hash) => {
      if (err) return next(err);

      this.auth.password = hash;
      next();
    });
  } else {
    next();
  }
};