import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  limit: 20,                
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    message: 'Too many login attempts from this IP. Try again later.',
  },
});

export default loginLimiter;