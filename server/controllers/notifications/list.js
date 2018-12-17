const mongoose = require('mongoose');
const Notification = require('../../models/Notification/Notification');

module.exports = (req, res, next) => {
  Notification
    .find({to: req.user})
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
};