// middleware/cacheControl.js

/**
 * Middleware to set Cache-Control headers to prevent caching.
 * This is used for protected routes to ensure that the browser does not
 * cache sensitive information that should not be accessible after logout.
 */
const noCache = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
};

export default noCache;