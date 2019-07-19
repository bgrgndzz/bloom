const mongoose = require('mongoose');
const User = require('../../models/User/User');
const Notification = require('../../models/Notification/Notification');

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
      error: 'Kendinizi takip edemezsiniz'
    });
  }

  User
    .findById(req.user)
    .exec((err, user) => {
      if (!user) {
        return res.status(403).send({
          authenticated: false,
          error: 'Bu sayfayı görüntülemek için giriş yapmanız gerekir'
        });
      }
      User
        .findById(req.params.user)
        .exec((err, followUser) => {
          if (!followUser) {
            return res.status(422).send({
              authenticated: true,
              error: 'Böyle bir kullanıcı yok'
            });
          }

          if (user.user.following.indexOf(followUser.id) !== -1) {
            user.user.following.splice(user.user.following.indexOf(followUser.id), 1);
            followUser.user.followers.splice(followUser.user.followers.indexOf(user.id), 1);
            user.save(err => {
              followUser.save(err => {
                Notification
                  .findOneAndRemove({
                    from: req.user,
                    to: followUser.id,
                    type: 'follow'
                  })
                  .exec((err, notification) => {
                    return res.status(200).send({
                      authenticated: true,
                      followed: false,
                      followers: followUser.user.followers
                    });
                  });
              })
            });
          } else {
            return res.status(200).send({
              authenticated: true,
              followed: false,
              followers: followUser.user.followers
            });
          }
        });
    });
};
