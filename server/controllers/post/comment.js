const mongoose = require('mongoose');
const Post = require('../../models/Post/Post');
const Comment = require('../../models/Comment/Comment');
const User = require('../../models/User/User');
const Notification = require('../../models/Notification/Notification');

const trim = str => str.replace(/\s+/g,' ').trim();

module.exports = (req, res, next) => {
  if (!req.params || !req.params.post) {
    return res.status(422).send({
      authenticated: true,
      error: 'Lütfen bir paylaşım seçtiğinizden emin olun'
    });
  }

  if (!req.body || !req.body.text || trim(req.body.text) === '') {
    return res.status(422).send({
      authenticated: true,
      error: 'Lütfen bir yazı gönderdiğinizden emin olun'
    });
  }

  Post
    .findById(req.params.post)
    .exec((err, post) => {
      if (!post) {
        return res.status(422).send({
          authenticated: true,
          error: 'Böyle bir paylaşım yok'
        });
      }
      Comment
        .findOne({
          text: req.body.text,
          author: req.user,
          post: req.params.post
        })
        .exec((err, comment) => {
          if (comment) {
            return res.status(422).send({
              authenticated: true,
              error: 'Bunu zaten paylaştınız'
            });
          }

          const newComment = new Comment({
            text: req.body.text,
            author: req.user,
            post: req.params.post,
            anonymous: req.body.anonymous
          });
          newComment.save(err => {
            post.comments.push(newComment._id);
            post.save(err => {
              if (post.author.toString() === req.user) {
                return res.status(200).send({
                  authenticated: true
                });
              }

              const newNotification = new Notification({
                from: req.user,
                to: post.author,
                type: 'comment',
                post: req.params.post,
                topic: post.topic,
                anonymous: req.body.anonymous
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
                        body: `${self.user.firstName} ${self.user.lastName} "${post.topic}" başlığındaki bir paylaşımına yorum yaptı`,
                        custom: { sender: 'Bloom' },
                        priority: 'high',
                        contentAvailable: true,
                        delayWhileIdle: true,
                        retries: 1,
                        badge: 2,
                        sound: 'notification.wav',
                        soundName: 'notification.wav',
                        android_channel_id: 'Bloom',
                        action: 'comment',
                        post: req.params.post,
                        truncateAtWordEnd: true,
                        expiry: Math.floor(Date.now() / 1000) + 28 * 86400,
                      },
                      (err, result) => {
                        return res.status(200).send({
                          authenticated: true
                        });
                      }
                    );
                  });
              });
            });
          });
        });
    });
};
