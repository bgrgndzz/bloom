const mongoose = require('mongoose');
const Post = require('../../models/Post/Post');
const Comment = require('../../models/Comment/Comment');
const Topic = require('../../models/Topic/Topic');
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
                return res.status(200).send({
                  authenticated: true
                });
              });
            });
          });
        });
    });
};
