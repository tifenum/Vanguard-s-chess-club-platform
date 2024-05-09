// middleware/authenticateToken.js

const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log("ereeeeeeeeeerrr");
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, 'admin', (err, user) => {
    if (err) {
          // console.log("eroooooooooooooooooorrr");

      return res.sendStatus(403); // Forbidden
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken; 
