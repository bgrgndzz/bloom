module.exports = (jwt, topic, body, callback) => {
  fetch('http://192.168.1.34:3000/posts/create/' + topic, {
    method: 'POST', 
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': jwt
    },
    body: JSON.stringify(body)
  })
  .then(response => response.json())
  .then(response => {
    if (response.error) return callback(response.error);
    return callback(null, response);
  })
  .catch(callback);
};