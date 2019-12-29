const mongoose = require('mongoose');
const Notification = require('../../models/Notification/Notification');
const User = require('../../models/User/User');

module.exports = (req, res, next) => {
  const page = parseInt(req.params.page);

  User
    .findById(req.user)
    .select('user')
    .exec((err, self) => {
      Notification.paginate(
        {
          to: req.user,
          from: {$nin: self.user.blocked}
        },
        {
          sort: '-date',
          populate: 'from',
          limit: 10,
          page
        },
        (err, notifications) => {
          notifications = notifications.docs.map(notification => (notification.from ? {
            ...notification,
            from: {
              _id: notification.from._id,
              ...notification.from.user
            }
          } : {...notification}));

          Notification.updateMany({
            _id: {$in: notifications.map(notification => notification.id)},
            seen: false
          }, {$set: {seen: true}}, (err, raw) => {
            return res.status(200).send({
              authenticated: true,
              notifications
            });
          });
        });
    });
};
