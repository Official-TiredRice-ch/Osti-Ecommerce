const logger = require('../../utils/logger');

// Middleware to automatically log actions to audit_logs
exports.logAction = (action, entity = null) => {
  return (req, res, next) => {
    const originalJson = res.json.bind(res);
    
    res.json = function(data) {
      // Only log successful operations (2xx status codes)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const db = req.app.locals.db;
        const user_id = req.user ? req.user.id : null;
        const entity_id = req.params.userId || req.params.productId || req.params.categoryId || data.id || null;
        const ip_address = req.ip || req.connection.remoteAddress;
        const user_agent = req.headers['user-agent'];
        
        const description = `${req.method} ${req.originalUrl}`;

        const sql = `
          INSERT INTO audit_logs (user_id, action, entity, entity_id, description, ip_address, user_agent)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.run(sql, [user_id, action, entity, entity_id, description, ip_address, user_agent], (err) => {
          if (err) {
            logger.error('Error logging audit', err);
          }
        });
      }

      return originalJson(data);
    };

    next();
  };
};
