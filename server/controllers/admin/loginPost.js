module.exports = (req, res, next) => {
  if (!req.body.password) {
    return res.render('admin/login', {
      error: 'Lütfen bir şifre girin'
    });
  }
  
  if (req.body.password !== process.env.ADMIN_PASSWORD) {
    return res.render('admin/login', {
      error: 'Girdiğiniz şifre yanlış'
    });
  }

  req.session.admin = true;
  res.redirect('/admin/panel');
}