const moment = require('moment');

const mongoose = require('mongoose');
const Topic = require('../../models/Topic/Topic');

module.exports = (req, res, next) => {
  const page = parseInt(req.params.page);

  Topic
    .find()
    .populate('posts')
    .sort('-lastDate')
    .exec((err, topics) => {
      if ((req.params && req.params.sort === 'popular') || (!req.params || !req.params.sort)) {
        const rank = topic => {
          const topicLifetime = moment().diff(moment(topic.posts[0].date), 'minutes') / (60 * 24);
          let postCount, divisor;
          if (topicLifetime > 1) {
            postCount = topic.posts.filter(post => moment().diff(moment(post.date), 'minutes') / (60 * 24) <= 1).length;
            divisor = 1;
          } else if (topicLifetime < 0.25) {
            postCount = topic.posts.length;
            divisor = 0.25;
          } else {
            postCount = topic.posts.length;
            divisor = topicLifetime;
          }

          return postCount / divisor;
        };
        topics = topics.sort((prev, cur) => rank(cur) - rank(prev));
      }

      topics = topics.map(topic => ({
        id: topic.id,
        ...topic._doc,
        posts: topic.posts.length
      }));

      res.status(200).send({
        authenticated: true,
        topics: topics.slice((page - 1) * 10, page * 10)
      });
    });
};