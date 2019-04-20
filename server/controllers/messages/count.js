const mongoose = require('mongoose');
const Message = require('../../models/Message/Message');
const User = require('../../models/User/User');

module.exports = (req, res) => {
  User
    .findById(req.user)
    .select('user')
    .exec((err, self) => {
      Message
        .count({
          to: req.user,
          from: { $nin: self.user.blocked },
          seen: false
        })
        .exec((err, messages) => {
          return res.status(200).send({
            authenticated: true,
            messages
          });
        });
    });
};
