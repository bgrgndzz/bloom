const mongoose = require('mongoose');
const Notification = require('../../models/Notification/Notification');
const User = require('../../models/User/User');

module.exports = (req, res, next) => {
  User
    .findById(req.user)
    .select('user')
    .exec((err, self) => {
      Notification
        .find({
          to: req.user,
          from: {$nin: self.user.blocked}
        })
        .populate('from')
        .sort('-date')
        .exec((err, notifications) => {
          notifications = notifications.map(notification => ({
            ...notification._doc,
            from: {
              _id: notification.from.id,
              ...notification.from._doc.user
            }
          }));

          Notification.updateMany({to: req.user}, {$set: {seen: true}}, (err, raw) => {
            return res.status(200).send({
              authenticated: true,
              notifications
            });
          });
        });
    });
};