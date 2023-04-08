import rateLimit from 'express-rate-limit';

export default rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Too many requests from this IP, please try again in an 1 min',
});
