const mongoose = require('mongoose');
const User = require('../../models/User/User');

module.exports = (req, res, next) => {
  User
    .find()
    .exec((err, users) => {
      res.status(200).send({
        authenticated: true,
        users: users.map(user => ({
          _id: user._id,
          name: `${user.user.firstName} ${user.user.lastName}`
        }))
      });
    });
};
