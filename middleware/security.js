const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

module.exports = {
  secureHeaders: helmet(),
  rateLimiter: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  }),
  csrfProtection: require('csurf')({ cookie: true }),
};
