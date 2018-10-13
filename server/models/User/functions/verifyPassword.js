const bcrypt = require('bcrypt');

module.exports = function (password, callback) {
  bcrypt.compare(password, this.auth.password, (err, res) => {
    if (err) return callback(err);
    callback(null, res);
  });
};