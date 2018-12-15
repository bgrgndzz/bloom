const moment = require('moment');

const mongoose = require('mongoose');
const Topic = require('../../models/Topic/Topic');

module.exports = (req, res, next) => {
  Topic
    .find()
    .sort('-lastDate')
    .exec((err, topics) => {
      topics = topics.map(topic => ({
        id: topic.id,
        ...topic._doc,
        posts: topic.posts.length
      }));
      
      if ((req.params && req.params.sort === 'popular') || (!req.params || !req.params.sort)) {
        // Sorting algorithm 1:
        // (posts ^ 1.5) * (likes ^ .5)
        // divided by
        // ((lastPost.minutesAge + 120) ^ .75)
        const rank = topic => (topic.posts ** 1.5) * (topic.likeCount ** 0.5) / (((moment().diff(moment(topic.lastDate), 'hours')) + 2) ** .75);
        topics = topics.sort((prev, cur) => rank(cur) - rank(prev));
      }

      res.status(200).send({
        authenticated: true,
        topics
      });
    });
};