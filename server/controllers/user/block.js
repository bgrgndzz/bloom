const mongoose = require('mongoose');
const User = require('../../models/User/User');

module.exports = (req, res, next) => {
  if (!req.params || !req.params.user) {
    return res.status(422).send({
      authenticated: true,
      error: 'Lütfen bir kullanıcı seçtiğinizden emin olun'
    });
  }

  if (req.params.user === req.user) {
    return res.status(422).send({
      authenticated: true,
      error: 'Kendinizi engelleyemezsiniz'
    });
  }

  User
    .findById(req.user)
    .exec((err, user) => {
      if (!user) {
        return res.status(422).send({
          authenticated: true,
          error: 'Böyle bir kullanıcı yok'
        });
      }

      if (user.user.blocked.indexOf(req.params.user) === -1) {
        user.user.blocked.push(req.params.user);
        user.save(err => {
          return res.status(200).send({
            authenticated: true,
            blocked: true
          });
        });
      } else {
        return res.status(200).send({
          authenticated: true,
          blocked: true
        });
      }
    });
};