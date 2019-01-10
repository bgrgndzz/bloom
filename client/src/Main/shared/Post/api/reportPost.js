module.exports = (jwt, post, callback) => {
  fetch(`https://www.bloomapp.tk/post/report/${post}`, {
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