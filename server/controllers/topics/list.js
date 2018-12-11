const moment = require('moment');

const mongoose = require('mongoose');
const Topic = require('../../models/Topic/Topic');

module.exports = (req, res, next) => {
  Topic
    .find()
    .sort('-date')
    .populate('author')
    .exec((err, topics) => {
      topics = topics.map(topic => ({
        id: topic.id,
        postCount: topic.posts.length,
        ...topic._doc
      }));
      
      if ((req.params && req.params.sort === 'popular') || (!req.params || !req.params.sort)) {
        // Sorting algorithm 1:
        // (posts ^ 1.5) * (likes ^ .5)
        // divided by
        // ((lastPost.minutesAge + 120) ^ .75)
        const rank = topic => (topic.postCount ** 1.5) * (topic.likeCount ** 0.5) / (((moment().diff(moment(topic.posts[topic.posts.length - 1]), 'minutes')) + 120) ** .75);
        topics = topics.sort((prev, cur) => rank(cur) - rank(prev));
      }

      res.status(200).send({
        authenticated: true,
        topics
      });
    });
};