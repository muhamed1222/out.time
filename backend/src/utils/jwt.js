const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'outtime-api'
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Недействительный токен');
  }
};

const generateAuthTokens = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    companyId: user.company_id || user.companyId,
    iat: Math.floor(Date.now() / 1000)
  };

  const accessToken = generateToken(payload);
  
  return {
    accessToken,
    tokenType: 'Bearer',
    expiresIn: JWT_EXPIRES_IN
  };
};

module.exports = {
  generateToken,
  verifyToken,
  generateAuthTokens
}; 