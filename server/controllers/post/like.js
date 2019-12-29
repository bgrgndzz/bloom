const mongoose = require('mongoose');

const User = require('../../models/User/User');
const Post = require('../../models/Post/Post');
const Topic = require('../../models/Topic/Topic');
const Notification = require('../../models/Notification/Notification');

module.exports = (req, res, next) => {
  if (!req.params || !req.params.post) {
    return res.status(422).send({
      authenticated: true,
      error: 'Lütfen bir paylaşım girdiğinizden emin olun'
    });
  }
  Post
    .findById(req.params.post)
    .populate('author', 'notificationTokens')
    .exec((err, post) => {
      if (!post) {
        return res.status(422).send({
          authenticated: true,
          error: 'Böyle bir paylaşım yok'
        });
      }

      if (post.likes.indexOf(req.user) === -1) {
        post.likes.push(req.user);
        post.likeCount += 1;
        post.save(err => {
          Topic
            .find({ topic: post.topic })
            .exec((err, topic) => {
              topic.likeCount += 1;

              const newNotification = new Notification({
                from: req.user,
                to: post.author,
                type: 'like',
                topic: post.topic
              });

              newNotification.save(err => {
                User
                  .findById(req.user)
                  .select('user.firstName user.lastName')
                  .exec((err, self) => {
                    req.push.send(
                      post.author.notificationTokens,
                      {
                        topic: 'com.bgrgndzz.bloom',
                        body: `${self.user.firstName} ${self.user.lastName} "${post.topic}" başlığındaki bir paylaşımını beğendi`,
                        custom: { sender: 'Bloom' },
                        priority: 'high',
                        contentAvailable: true,
                        delayWhileIdle: true,
                        retries: 1,
                        badge: 2,
                        sound: 'notification.wav',
                        soundName: 'notification.wav',
                        android_channel_id: 'Bloom',
                        action: 'like',
                        post: req.params.post,
                        truncateAtWordEnd: true,
                        expiry: Math.floor(Date.now() / 1000) + 28 * 86400,
                      },
                      (err, result) => {
                        return res.status(200).send({
                          authenticated: true,
                          liked: true,
                          likes: post.likes
                        });
                      }
                    );
                  });
              });
            });
        });
      } else {
        return res.status(200).send({
          authenticated: true,
          liked: true,
          likes: post.likes
        });
      }
    });
};
