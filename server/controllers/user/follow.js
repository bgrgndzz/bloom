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

          if (user.user.following.indexOf(followUser.id) === -1) {
            user.user.following.push(followUser.id);
            user.user.followingCount += 1;
            followUser.user.followers.push(user.id);
            followUser.user.followersCount += 1;
            user.save(err => {
              followUser.save(err => {
                return res.status(200).send({
                  authenticated: true,
                  followed: true,
                  followersCount: followUser.user.followersCount
                });
              });
            });
          } else {
            return res.status(200).send({
              authenticated: true,
              followed: true,
              followersCount: followUser.user.followersCount
            });
          }
        });
    });
};