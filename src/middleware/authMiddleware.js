import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'Forbidden: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
const secret = process.env.JWT_SECRET_KEY || 'your_jwt_secret'; // Adjust as needed
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
};

export default authMiddleware;
