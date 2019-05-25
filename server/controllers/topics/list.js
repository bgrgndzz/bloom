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
        lifetime: {
          $divide: [
            { $subtract: [new Date(), '$date'] },
            1000 * 60 * 60 * 24
          ]
        }
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
                  cond: {
                    $lte: [
                      {
                        $divide: [
                          { $subtract: [new Date(), '$$post.date'] },
                          1000 * 60 * 60 * 24
                        ]
                      },
                      1
                    ]
                  }
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
        posts: 1,
        rank: 1,
        lastDate: 1
      }
    },
    { $sort: { rank: -1, lastDate: -1 } },
    { $skip: (page - 1) * 10 },
    { $limit: 10 }
  ];

  const newAggregation = [
    {
      $addFields: {
        posts: { $size: '$posts' }
      }
    },
    {
      $project: {
        _id: 1,
        topic: 1,
        posts: 1,
        lastDate: 1
      }
    },
    { $sort: { lastDate: -1 } },
    { $skip: (page - 1) * 10 },
    { $limit: 10 }
  ];

  const randomAggregation = [
    { $sample: { size: 10 } },
    {
      $addFields: {
        posts: { $size: '$posts' }
      }
    },
    {
      $project: {
        _id: 1,
        topic: 1,
        posts: 1
      }
    }
  ];

  let chosen;

  switch (req.params.sort) {
    case 'popular':
      chosen = popularAggregation;
      break;
    case 'new':
      chosen = newAggregation;
      break;
    default:
      chosen = randomAggregation;
      break;
  }

  Topic
    .aggregate(chosen)
    .exec((err, topics) => {
      res.status(200).send({
        authenticated: true,
        topics
      });
    });
};
