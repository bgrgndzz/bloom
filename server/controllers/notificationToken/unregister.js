const mongoose = require('mongoose');
const User = require('../../models/User/User');

module.exports = (req, res) => {
  User.update(
    { _id: req.user },
    { $pull: { notificationTokens: req.body.notificationToken } }
  ).then((err) => res.status(200).send({ authenticated: false }));
};
