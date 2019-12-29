const mongoose = require('mongoose');
const User = require('../../models/User/User');
const Message = require('../../models/Message/Message');

module.exports = (req, res, next) => {
  if (!req.params || !req.params.user) {
    return res.status(422).send({
      authenticated: true,
      error: 'Lütfen bir kişi seçtiğinizden emin olun'
    });
  }

  const page = parseInt(req.params.page);

  Message
    .paginate(
      {
        $or: [
          {$and: [{from: req.user}, {to: req.params.user}]},
          {$and: [{from: req.params.user}, {to: req.user}]}
        ]
      },
      {
        sort: '-date',
        limit: 10,
        page
      },
      (err, messages) => {
        Message.updateMany({
          _id: {$in: messages.docs.map(message => message.id)},
          from: req.params.user,
          seen: false
        }, {$set: {seen: true}}, (err, raw) => {
          User
            .findById(req.params.user)
            .select('user')
            .exec((err, user) => {
              messages = messages.docs.map(message => ({
                ...message,
                type: message.from.toString() === req.user ? 'sent' : 'received'
              }));

              const seenMessages = messages
                .filter(message => message.type === 'received')
                .map(message => message.id);

              let online = false;

              if (req.app.locals.users.find(user => user.id === req.params.user)) {
                const toSocket = req.app.locals.users.find(user => user.id === req.params.user).socket.id;
                req.io.to(`${toSocket}`).emit('seen message', seenMessages);
                online = true;
              }

              return res.status(200).send({
                authenticated: true,
                otherUser: {
                  ...user._doc,
                  online
                },
                messages
              });
            });
        });
      }
    );
};
