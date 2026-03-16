import jwt from 'jsonwebtoken';

const verifyAdmin = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'your-app',
      audience: 'admin',
    });

    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export default verifyAdmin;