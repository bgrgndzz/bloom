const mongoose = require('mongoose');
const User = require('../../models/User/User');
const Post = require('../../models/Post/Post');
const Topic = require('../../models/Topic/Topic');
const Notification = require('../../models/Notification/Notification');

const trim = str => str.replace(/\s+/g,' ').trim();

module.exports = (req, res, next) => {
  if (!req.params || !req.params.topic) {
    return res.status(422).send({
      authenticated: true,
      error: 'Lütfen bir başlık girdiğinizden emin olun'
    });
  }

  if (!req.body || !req.body.text || trim(req.body.text) === '') {
    return res.status(422).send({
      authenticated: true,
      error: 'Lütfen bir yazı gönderdiğinizden emin olun'
    });
  }

  req.params.topic = trim(req.params.topic);

  Post
    .findOne({
      text: req.body.text,
      author: req.user,
      topic: req.params.topic
    })
    .exec((err, post) => {
      if (post) {
        return res.status(422).send({
          authenticated: true,
          error: 'Bunu zaten paylaştınız'
        });
      }

      const mentionRegex = /\[mention: \((.*?)\)\((.*?)\)\]/gi;
      const mentions = req.body.text.match(mentionRegex);

      if (mentions) {
        mentions.forEach(mention => {
          const mentionArgs = mentionRegex.exec(mention);
          if (!mentionArgs) return;

          const toUser = mentionArgs[1];

          const newNotification = new Notification({
            from: req.user,
            to: toUser,
            type: 'mention',
            topic: req.params.topic
          });
          newNotification.save(err => {
            User
              .findById(req.user)
              .select('user.firstName user.lastName')
              .exec((err, self) => {
                User
                  .findById(toUser)
                  .select('notificationTokens')
                  .exec((err, user) => {
                    req.push.send(
                      user.notificationTokens,
                      {
                        topic: 'com.bgrgndzz.bloom',
                        body: `${self.user.firstName} ${self.user.lastName} "${req.params.topic}" başlığında senden bahsetti`,
                        custom: { sender: 'Bloom' },
                        priority: 'high',
                        contentAvailable: true,
                        delayWhileIdle: true,
                        retries: 1,
                        badge: 2,
                        sound: 'notification.wav',
                        soundName: 'notification.wav',
                        android_channel_id: 'Bloom',
                        action: 'mention',
                        post: req.params.post,
                        truncateAtWordEnd: true,
                        expiry: Math.floor(Date.now() / 1000) + 28 * 86400,
                      },
                      (err, result) => {
                        const newPost = new Post({
                          text: req.body.text,
                          author: req.user,
                          topic: req.params.topic,
                          anonymous: req.body.anonymous
                        });
                        newPost.save(err => {
                          Topic
                            .findOne({topic: req.params.topic})
                            .exec((err, topic) => {
                              if (topic) {
                                topic.posts.push(newPost._id);
                                topic.lastDate = Date.now();
                                topic.save(err => {
                                  return res.status(200).send({
                                    authenticated: true
                                  });
                                });
                              } else {
                                const newTopic = new Topic({
                                  topic: req.params.topic,
                                  author: req.user,
                                  posts: [newPost._id]
                                });
                                newTopic.save(err => {
                                  return res.status(200).send({
                                    authenticated: true
                                  });
                                });
                              }
                            });
                        });
                      }
                    );
                  });
              });
          });
        });
      } else {
        const newPost = new Post({
          text: req.body.text,
          author: req.user,
          topic: req.params.topic,
          anonymous: req.body.anonymous
        });
        newPost.save(err => {
          Topic
            .findOne({topic: req.params.topic})
            .exec((err, topic) => {
              if (topic) {
                topic.posts.push(newPost._id);
                topic.lastDate = Date.now();
                topic.save(err => {
                  return res.status(200).send({
                    authenticated: true
                  });
                });
              } else {
                const newTopic = new Topic({
                  topic: req.params.topic,
                  author: req.user,
                  posts: [newPost._id]
                });
                newTopic.save(err => {
                  return res.status(200).send({
                    authenticated: true
                  });
                });
              }
            });
        });
      }
    });
};
