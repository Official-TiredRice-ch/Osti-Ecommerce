const logger = require('../../utils/logger');

// Middleware to verify user is authenticated
exports.authenticate = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const db = req.app.locals.db;
  const sql = `SELECT id, username, email, role, status FROM users WHERE id = ?`;

  db.get(sql, [userId], (err, user) => {
    if (err) {
      logger.error('Error authenticating user', err);
      return res.status(500).json({ error: 'Authentication failed' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid user' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Account is disabled' });
    }

    req.user = user;
    next();
  });
};

// Middleware to check if user has required role
exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

// Middleware to check if user is accessing their own resource
exports.authorizeOwner = (req, res, next) => {
  const userId = req.params.userId || req.body.user_id;
  
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Admin can access any resource
  if (req.user.role === 'admin') {
    return next();
  }

  // User can only access their own resource
  if (req.user.id != userId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  next();
};
