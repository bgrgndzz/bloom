const mongoose = require('mongoose');
const User = require('../../models/User/User');
const Topic = require('../../models/Topic/Topic');
const Report = require('../../models/Report/Report');
const Post = require('../../models/Post/Post');
const Notification = require('../../models/Notification/Notification');

const moment = require('moment');
const {exec} = require('child_process');

module.exports = (req, res, next) => {
  if (!req.session.admin) {
    res.redirect('/admin/login');
  }

  Post.find((err, posts) => {
    const postCount = posts.length;

    Topic.find((err, topics) => {
      const topicCount = topics.length;

      User.find((err, users) => {
        const userCount = users.length;

        Report
          .find()
          .populate('from')
          .populate('post')
          .exec((err, reports) => {
            reports.forEach(report => {report.fromNow = moment(report.date).fromNow()});

            res.render('admin/panel', {
              numericData: {
                postCount: {
                  title: 'Toplam Paylaşım',
                  value: postCount
                },
                topicCount: {
                  title: 'Toplam Konu',
                  value: topicCount
                },
                userCount: {
                  title: 'Toplam Kullanıcı',
                  value: userCount
                }
              },
              tabularData: {
                reports: {
                  title: 'Şikayetler',
                  value: reports
                }
              }
            });
        });
      });
    });
  });
}