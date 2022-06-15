module.exports = {
  secret: process.env.secret,
  jwtExpiration: 604800, // 1 week
  jwtRefreshExpiration: 2592000, // 1 month
  /* for test */
  // jwtExpiration: 60, // 1 minute
  // jwtRefreshExpiration: 120, // 2 minutes
};
