const moment = require('moment');

const mongoose = require('mongoose');
const Topic = require('../../models/Topic/Topic');

module.exports = (req, res, next) => {
  const page = parseInt(req.params.page, 10);

  const popularAggregation = [
    {
      $lookup: {
        from: 'posts',
        localField: 'posts',
        foreignField: '_id',
        as: 'postLinks'
      }
    },
    {
      $addFields: {
        posts: { $size: '$postLinks' },
        lifetime: moment().diff(moment({ $arrayElemAt: ['$postLinks.date', 0] }), 'minutes') / (60 * 24)
      }
    },
    {
      $addFields: {
        rank: {
          $cond: [
            { $gt: ['$lifetime', 1] },
            {
              $size: {
                $filter: {
                  input: '$postLinks',
                  as: 'post',
                  cond: { $lte: [moment().diff(moment('$$post.date'), 'minutes') / (60 * 24), 1] }
                }
              }
            },
            {
              $cond: [
                { $lt: ['$lifetime', 0.25] },
                { $divide: ['$posts', 0.25] },
                { $divide: ['$posts', '$lifetime'] }
              ]
            }
          ]
        }
      }
    },
    {
      $project: {
        _id: 1,
        topic: 1,
        rank: 1
      }
    },
    { $sort: { rank: -1, lastDate: -1 } },
    { $skip: (page - 1) * 10 },
    { $limit: 10 }
  ];

  const newAggregation = [
    {
      $project: {
        _id: 1,
        topic: 1,
        lastDate: 1
      }
    },
    { $sort: { lastDate: -1 } },
    { $skip: (page - 1) * 10 },
    { $limit: 10 }
  ];

  Topic
    .aggregate(
      (
        (req.params && req.params.sort === 'popular') ||
        (!req.params || !req.params.sort)
      ) ? popularAggregation : newAggregation
    )
    .exec((err, topics) => {
      res.status(200).send({
        authenticated: true,
        topics
      });
    });
};
