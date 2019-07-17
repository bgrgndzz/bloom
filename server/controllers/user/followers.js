const mongoose = require('mongoose');
const User = require('../../models/User/User');

module.exports = (req, res, next) => {
  if (!req.params || !req.params.user) {
    return res.status(422).send({
      authenticated: true,
      error: 'Lütfen bir kişi seçtiğinizden emin olun'
    });
  }

  User
    .findById(req.user)
    .select('user.following')
    .lean()
    .exec((err, self) => {
      User
        .findById(req.params.user)
        .select('user.following user.followers')
        .lean()
        .populate('user.followers', 'user.firstName user.lastName user.profilepicture')
        .populate('user.following', 'user.firstName user.lastName user.profilepicture')
        .exec((err, user) => {
          if (!user) {
            return res.status(422).send({
              authenticated: true,
              error: 'Böyle bir kullanıcı yok'
            });
          }

          const mutual = user.user.followers.filter(follower => self.user.following.find(following => following.toString() === follower._id.toString()));

          return res.status(200).send({
            authenticated: true,
            followers: user.user.followers,
            following: user.user.following,
            mutual
          });
        });
    });
};
