const mongoose = require('mongoose');
const async = require('async');

const User = require('../../models/User/User');
const Message = require('../../models/Message/Message');

const ObjectId = mongoose.Types.ObjectId;

module.exports = (req, res, next) => {
  const page = parseInt(req.params.page);

  User
    .findById(req.user)
    .select('user')
    .exec((err, self) => {
      Message.aggregate([
        {
          $facet: {
            to: [
              {$match: {
                from: ObjectId(req.user),
                to: {$nin: self.user.blocked},
              }},
              { $sort: {date: -1} },
              {
                $group: {
                  _id: '$to',
                  doc: { $first: '$$ROOT' }
                }
              },
              { $replaceRoot: { newRoot: '$doc' } }
            ],
            from: [
              {$match: {
                to: ObjectId(req.user),
                from: {$nin: self.user.blocked},
              }},
              { $sort: {date: -1} },
              {
                $group: {
                  _id: '$from',
                  doc: { $first: '$$ROOT' }
                }
              },
              { $replaceRoot: { newRoot: '$doc' } }
            ],
          }
        },
        { $project: { messages: { $setUnion: ['$to', '$from'] } } },
        { $unwind: '$messages' },
        { $replaceRoot: { newRoot: '$messages' } }
      ]).exec((err, messages) => {
        let uniqueUsers = [];
        let conversations = [];

        messages = messages.sort((a, b) => b.date - a.date);

        async.each(
          messages,
          (message, callback) => {
            const type = message.from.toString() === req.user ? 'sent' : 'received'
            const otherUser = type === 'sent' ? message.to : message.from;

            if (uniqueUsers.includes(otherUser.toString())) return callback();

            uniqueUsers.push(otherUser.toString());

            if (
              (uniqueUsers.length <= 10 * (page - 1)) ||
              (uniqueUsers.length > 10 * page)
            ) return callback();

            User
              .findById(otherUser)
              .select('user')
              .exec((err, user) => {
                Message.countDocuments(
                  {
                    from: otherUser,
                    to: req.user,
                    seen: false
                  },
                  (err, unseen) => {
                    conversations.push({
                      ...message,
                      otherUser: user,
                      type,
                      unseen
                    });

                    return callback();
                  }
                )
              });
          },
          err => res.status(200).send({
            authenticated: true,
            conversations: conversations.sort((a, b) => b.date - a.date)
          })
        );
      });
    });
};
