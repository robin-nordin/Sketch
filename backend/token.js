const jwt = require('jsonwebtoken');

function generateToken(user) {
  return jwt.sign({ user }, process.env.TOKEN_SECRET);
}

function validateToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false });
  
  jwt.verify(token, process.env.TOKEN_SECRET, (error) => {
    if (error) return res.status(403).json({ success: false });
    const { user } = decodeToken(token);
    res.locals.user = user;
    next();
  });
}

function decodeToken(token) {
  return jwt.decode(token);
}

exports.generateToken = generateToken;
exports.validateToken = validateToken;
