const mongoose = require('mongoose');
const Report = require('../../models/Report/Report');
const Post = require('../../models/Post/Post');

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

      Report
        .findOne({
          from: req.user,
          post: req.params.post
        })
        .exec((err, report) => {
          if (report) {
            return res.status(422).send({
              authenticated: true,
              error: 'Bu paylaşımı zaten şikayet ettiniz'
            });
          }

          const newReport = new Report({
            from: req.user,
            post: req.params.post,
          });
          newReport.save(err => {
            return res.status(200).send({
              authenticated: true
            });
          });
        });
    });
};