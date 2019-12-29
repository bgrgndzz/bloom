const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');
const User = require('../../models/User/User');
const Notification = require('../../models/Notification/Notification');

const trim = str => str.replace(/\s+/g,' ').trim();

module.exports = (req, res, next) => {
  if (
    !req.body ||
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.school ||
    !req.body.email ||
    !req.body.password ||
    !req.body.password2
  ) {
    return res.status(422).send({
      authenticated: false,
      error: 'Lütfen tüm boşlukları doldurun'
    });
  }

  if (req.body.password !== req.body.password2) {
    return res.status(422).send({
      authenticated: false,
      error: 'Lütfen girdiğiniz şifrelerin eşleştiğinden emin olun'
    });
  }

  req.body.firstName = trim(req.body.firstName);
  req.body.lastName = trim(req.body.lastName);

  User
    .findOne({ 'auth.email': req.body.email })
    .exec((err, userRes) => {
      if (userRes) {
        return res.status(422).send({
          authenticated: false,
          error: 'Bu e-mail ile kayıtlı bir hesap zaten var'
        });
      }

      const referralCode = Math.random().toString(36).substr(2, 9);

      const newUser = new User({
        auth: {
          email: req.body.email,
          password: req.body.password
        },
        user: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          school: req.body.school,
        },
        referral: {
          referralCode,
          referrerCode: req.body.referrerCode || ''
        }
      });
      return newUser.save(err => {
        const token = jwt.sign({ user: newUser.id }, process.env.JWT_SECRET, {
          expiresIn: 60 * 60 * 24 * 365 * 10 // 10 years
        });

        if (!req.body.referrerCode) {
          return res.status(200).send({
            authenticated: true,
            jwt: token
          });
        }

        User
          .find({ 'referral.referrerCode': req.body.referrerCode })
          .select('_id')
          .exec((err, users) => {
            if (users.length !== 3) {
              return res.status(200).send({
                authenticated: true,
                jwt: token
              });
            }

            User
              .findOne({ 'referral.referralCode': req.body.referrerCode })
              .exec((err, user) => {
                if (!user) {
                  return res.status(200).send({
                    authenticated: true,
                    jwt: token
                  });
                }

                if (!user.user.badges.includes('davetkar')) user.user.badges.push('davetkar');

                user.save(err => {
                  const newNotification = new Notification({
                    to: user._id,
                    type: 'bloom',
                    text: '3 kişiyi davet ettiğin için "Davetkar" isimli yeni bir bloop\'un var! Kullanmak için ayarlardan profilini düzenle.'
                  });
                  newNotification.save(err => {
                    req.push.send(
                      user.notificationTokens,
                      {
                        topic: 'com.bgrgndzz.bloom',
                        body: '3 kişiyi davet ettiğin için "Davetkar" isimli yeni bir bloop\'un var! Kullanmak için ayarlardan profilini düzenle.',
                        custom: { sender: 'Bloom' },
                        priority: 'high',
                        contentAvailable: true,
                        delayWhileIdle: true,
                        retries: 1,
                        badge: 2,
                        sound: 'notification.wav',
                        soundName: 'notification.wav',
                        android_channel_id: 'Bloom',
                        action: 'newbadge',
                        truncateAtWordEnd: true,
                        expiry: Math.floor(Date.now() / 1000) + 28 * 86400,
                      },
                      (err, result) => {
                        return res.status(200).send({
                          authenticated: true,
                          jwt: token
                        });
                      }
                    );
                  });
                });
              });
          });
      });
    });
};
