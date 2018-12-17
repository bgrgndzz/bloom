const mongoose = require('mongoose');
const Notification = require('../../models/Notification/Notification');

module.exports = (req, res, next) => {
  Notification
    .count({
      to: req.user,
      seen: false
    })
    .exec((err, notifications) => {
      return res.status(200).send({
        authenticated: true,
        notifications
      });
    });
};