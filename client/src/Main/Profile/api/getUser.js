module.exports = (jwt, user, callback) => {
  let url;
  if (user) {
    url = 'https://www.bloomapp.tk/user/' + user;
  } else {
    url = 'https://www.bloomapp.tk/user/';
  }

  fetch(url, {
    headers: {'x-access-token': jwt}
  })
  .then(response => response.json())
  .then(response => {
    if (!response.authenticated) return callback('unauthenticated');
    if (response.error) return callback(response.error);
    return callback(null, response);
  })
  .catch(callback);
};