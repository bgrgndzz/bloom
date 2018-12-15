const mongoose = require('mongoose');
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
    .exec((err, post) => {
      if (!post) {
        return res.status(422).send({
          authenticated: true,
          error: 'Böyle bir paylaşım yok'
        });
      }

      if (post.likes.indexOf(req.user) !== -1) {
        post.likes.splice(post.likes.indexOf(req.user), 1);
        post.likeCount -= 1;
        post.save(err => {
          Topic
            .find({topic: post.topic})
            .exec((err, topic) => {
              topic.likeCount -= 1;

              Notification
                .findOneAndRemove({
                  from: req.user,
                  to: post.author,
                  type: 'like'
                })
                .exec((err, notification) => {
                  if (notification) {
                    return res.status(200).send({
                      authenticated: true,
                      liked: false,
                      likes: post.likes
                    });
                  }
                });
            });
        });
      } else {
        return res.status(200).send({
          authenticated: true,
          liked: false,
          likes: post.likes
        });
      }
    });
};