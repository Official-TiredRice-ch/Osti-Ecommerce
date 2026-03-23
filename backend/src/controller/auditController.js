const logger = require('../../utils/logger');

// Log an audit entry
exports.logAudit = (req, res) => {
  const { user_id, action, entity, entity_id, description, ip_address, user_agent } = req.body;
  const db = req.app.locals.db;

  if (!action) {
    return res.status(400).json({ error: 'action is required' });
  }

  const sql = `
    INSERT INTO audit_logs (user_id, action, entity, entity_id, description, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [user_id || null, action, entity || null, entity_id || null, description || null, ip_address || null, user_agent || null], function(err) {
    if (err) {
      logger.error('Error logging audit', err);
      return res.status(500).json({ error: 'Failed to log audit' });
    }

    res.status(201).json({
      message: 'Audit logged successfully',
      id: this.lastID
    });
  });
};

// Get audit logs with filters
exports.getAuditLogs = (req, res) => {
  const { user_id, action, entity, limit = 100, offset = 0, days } = req.query;
  const db = req.app.locals.db;

  let sql = `
    SELECT al.*, u.username, u.email
    FROM audit_logs al
    LEFT JOIN users u ON al.user_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (user_id) {
    sql += ` AND al.user_id = ?`;
    params.push(user_id);
  }

  if (action) {
    sql += ` AND al.action = ?`;
    params.push(action);
  }

  if (entity) {
    sql += ` AND al.entity = ?`;
    params.push(entity);
  }

  if (days) {
    sql += ` AND al.created_at >= datetime('now', '-' || ? || ' days')`;
    params.push(parseInt(days));
  }

  sql += ` ORDER BY al.created_at DESC LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), parseInt(offset));

  db.all(sql, params, (err, logs) => {
    if (err) {
      logger.error('Error fetching audit logs', err);
      return res.status(500).json({ error: 'Failed to fetch audit logs' });
    }

    res.json({ logs, count: logs.length });
  });
};

// Get audit logs for a specific user
exports.getUserAuditLogs = (req, res) => {
  const { userId } = req.params;
  const { limit = 50, offset = 0 } = req.query;
  const db = req.app.locals.db;

  const sql = `
    SELECT * FROM audit_logs
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `;

  db.all(sql, [userId, parseInt(limit), parseInt(offset)], (err, logs) => {
    if (err) {
      logger.error('Error fetching user audit logs', err);
      return res.status(500).json({ error: 'Failed to fetch audit logs' });
    }

    res.json({ logs, count: logs.length });
  });
};

// Get audit logs for a specific entity
exports.getEntityAuditLogs = (req, res) => {
  const { entity, entityId } = req.params;
  const { limit = 50, offset = 0 } = req.query;
  const db = req.app.locals.db;

  const sql = `
    SELECT al.*, u.username, u.email
    FROM audit_logs al
    LEFT JOIN users u ON al.user_id = u.id
    WHERE al.entity = ? AND al.entity_id = ?
    ORDER BY al.created_at DESC
    LIMIT ? OFFSET ?
  `;

  db.all(sql, [entity, entityId, parseInt(limit), parseInt(offset)], (err, logs) => {
    if (err) {
      logger.error('Error fetching entity audit logs', err);
      return res.status(500).json({ error: 'Failed to fetch audit logs' });
    }

    res.json({ logs, count: logs.length });
  });
};

// Get audit statistics
exports.getAuditStats = (req, res) => {
  const { days = 30 } = req.query;
  const db = req.app.locals.db;

  const queries = {
    totalLogs: `
      SELECT COUNT(*) as total
      FROM audit_logs
      WHERE created_at >= datetime('now', '-' || ? || ' days')
    `,
    actionBreakdown: `
      SELECT action, COUNT(*) as count
      FROM audit_logs
      WHERE created_at >= datetime('now', '-' || ? || ' days')
      GROUP BY action
      ORDER BY count DESC
    `,
    entityBreakdown: `
      SELECT entity, COUNT(*) as count
      FROM audit_logs
      WHERE created_at >= datetime('now', '-' || ? || ' days') AND entity IS NOT NULL
      GROUP BY entity
      ORDER BY count DESC
    `,
    topUsers: `
      SELECT u.username, u.email, COUNT(*) as action_count
      FROM audit_logs al
      JOIN users u ON al.user_id = u.id
      WHERE al.created_at >= datetime('now', '-' || ? || ' days')
      GROUP BY al.user_id
      ORDER BY action_count DESC
      LIMIT 10
    `
  };

  const stats = {};
  let completed = 0;
  const total = Object.keys(queries).length;

  Object.entries(queries).forEach(([key, sql]) => {
    db.all(sql, [parseInt(days)], (err, rows) => {
      if (err) {
        logger.error(`Error fetching ${key}`, err);
        stats[key] = null;
      } else {
        stats[key] = key === 'totalLogs' ? rows[0].total : rows;
      }

      completed++;
      if (completed === total) {
        res.json({ stats, period_days: parseInt(days) });
      }
    });
  });
};

// Delete old audit logs (cleanup)
exports.cleanupAuditLogs = (req, res) => {
  const { days = 90 } = req.body;
  const db = req.app.locals.db;

  const sql = `
    DELETE FROM audit_logs
    WHERE created_at < datetime('now', '-' || ? || ' days')
  `;

  db.run(sql, [parseInt(days)], function(err) {
    if (err) {
      logger.error('Error cleaning up audit logs', err);
      return res.status(500).json({ error: 'Failed to cleanup audit logs' });
    }

    res.json({
      message: 'Audit logs cleaned up successfully',
      deleted_count: this.changes
    });
  });
};
