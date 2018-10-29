const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({
      authenticated: false, 
      error: 'Bu sayfayı görüntülemek için giriş yapmanız gerekir'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, jwtRes) => {
    if (err) {
      return res.status(403).send({
        authenticated: false, 
        error: 'Bu sayfayı görüntülemek için giriş yapmanız gerekir'
      });
    }

    req.user = jwtRes.user;
    next();
  });
};