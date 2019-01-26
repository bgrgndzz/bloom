const mongoose = require('mongoose');
const Notification = require('../../models/Notification/Notification');
const User = require('../../models/User/User');

module.exports = (req, res, next) => {
  User
    .findById(req.user)
    .select('user')
    .exec((err, self) => {
      Notification
        .count({
          to: req.user,
          from: {$nin: self.user.blocked},
          seen: false
        })
        .exec((err, notifications) => {
          return res.status(200).send({
            authenticated: true,
            notifications
          });
        });
    });
};