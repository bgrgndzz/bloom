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

          if (user.user.following.indexOf(followUser.id) === -1) {
            user.user.following.push(followUser.id);
            followUser.user.followers.push(user.id);
            user.save(err => {
              followUser.save(err => {
                const newNotification = new Notification({
                  from: req.user,
                  to: followUser.id,
                  type: 'follow'
                });
                newNotification.save(err => {
                  req.push.send(
                    followUser.notificationTokens,
                    {
                      topic: 'com.bgrgndzz.bloom',
                      body: `${user.user.firstName} ${user.user.lastName} seni takip etmeye başladı`,
                      custom: { sender: 'Bloom' },
                      priority: 'high',
                      contentAvailable: true,
                      delayWhileIdle: true,
                      retries: 1,
                      badge: 2,
                      sound: 'notification.wav',
                      soundName: 'notification.wav',
                      android_channel_id: 'Bloom',
                      action: 'follow',
                      post: req.params.post,
                      truncateAtWordEnd: true,
                      expiry: Math.floor(Date.now() / 1000) + 28 * 86400,
                    },
                    (err, result) => {
                      return res.status(200).send({
                        authenticated: true,
                        followed: true,
                        followers: followUser.user.followers
                      });
                    }
                  );
                });
              });
            });
          } else {
            return res.status(200).send({
              authenticated: true,
              followed: true,
              followers: followUser.user.followers
            });
          }
        });
    });
};
