const mongoose = require('mongoose');
const User = require('../../models/User/User');
const Message = require('../../models/Message/Message');

const trim = str => str.replace(/\s+/g,' ').trim();

module.exports = (req, res, next) => {
  if (!req.params || !req.params.user) {
    return res.status(422).send({
      authenticated: true,
      error: 'Lütfen bir kişi seçtiğinizden emin olun'
    });
  }

  if (!req.body || !req.body.message || trim(req.body.message) === '') {
    return res.status(422).send({
      authenticated: true,
      error: 'Lütfen bir mesaj yazdığınızdan emin olun'
    });
  }

  const newMessage = new Message({
    from: req.user,
    to: req.params.user,
    message: req.body.message
  });
  newMessage.save(err => {
    if (req.app.locals.users.find(user => user.id === req.user)) {
      const fromSocket = req.app.locals.users.find(user => user.id === req.user).socket.id;
      req.io.to(`${fromSocket}`).emit('new message', newMessage);
    }

    if (req.app.locals.users.find(user => user.id === req.params.user)) {
      const toSocket = req.app.locals.users.find(user => user.id === req.params.user).socket.id;
      req.io.to(`${toSocket}`).emit('new message', newMessage);
    }

    return res.status(200).send({
      authenticated: true
    });
  });
};
