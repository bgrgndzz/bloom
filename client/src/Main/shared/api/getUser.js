module.exports = (jwt, user, callback) => {
  let url;
  if (user) {
    url = 'http://192.168.1.34:3000/user/' + user;
  } else {
    url = 'http://192.168.1.34:3000/user/';
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