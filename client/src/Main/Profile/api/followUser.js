module.exports = (jwt, user, following, callback) => {
  fetch(`https://www.bloomapp.tk/user/${following ? 'unfollow' : 'follow'}/${user}`, {
    method: 'POST', 
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': jwt
    }
  })
  .then(response => response.json())
  .then(response => {
    if (!response.authenticated) return callback('unauthenticated');
    if (response.error) return callback(response.error);
    return callback(null, response);
  })
  .catch(callback);
};