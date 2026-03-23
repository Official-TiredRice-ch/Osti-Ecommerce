const logger = require('../../utils/logger');

// Log a search query
exports.logSearch = async (req, res) => {
  const { user_id, session_id, search_query, results_count, clicked_product_id } = req.body;
  const db = req.app.locals.db;

  if (!search_query) {
    return res.status(400).json({ error: 'search_query is required' });
  }

  const sql = `
    INSERT INTO search_history (user_id, session_id, search_query, results_count, clicked_product_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [user_id || null, session_id || null, search_query, results_count || 0, clicked_product_id || null], function(err) {
    if (err) {
      logger.error('Error logging search', err);
      return res.status(500).json({ error: 'Failed to log search' });
    }

    res.status(201).json({
      message: 'Search logged successfully',
      id: this.lastID
    });
  });
};

// Get search history for a user
exports.getUserSearchHistory = async (req, res) => {
  const { userId } = req.params;
  const { limit = 20 } = req.query;
  const db = req.app.locals.db;

  const sql = `
    SELECT id, search_query, results_count, clicked_product_id, created_at
    FROM search_history
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT ?
  `;

  db.all(sql, [userId, parseInt(limit)], (err, rows) => {
    if (err) {
      logger.error('Error fetching user search history', err);
      return res.status(500).json({ error: 'Failed to fetch search history' });
    }

    res.json({ searches: rows });
  });
};

// Get popular searches
exports.getPopularSearches = async (req, res) => {
  const { limit = 10, days = 7 } = req.query;
  const db = req.app.locals.db;

  const sql = `
    SELECT search_query, COUNT(*) as search_count
    FROM search_history
    WHERE created_at >= datetime('now', '-' || ? || ' days')
    GROUP BY search_query
    ORDER BY search_count DESC
    LIMIT ?
  `;

  db.all(sql, [parseInt(days), parseInt(limit)], (err, rows) => {
    if (err) {
      logger.error('Error fetching popular searches', err);
      return res.status(500).json({ error: 'Failed to fetch popular searches' });
    }

    res.json({ popular_searches: rows });
  });
};

// Update clicked product for a search
exports.updateClickedProduct = async (req, res) => {
  const { searchId } = req.params;
  const { clicked_product_id } = req.body;
  const db = req.app.locals.db;

  if (!clicked_product_id) {
    return res.status(400).json({ error: 'clicked_product_id is required' });
  }

  const sql = `UPDATE search_history SET clicked_product_id = ? WHERE id = ?`;

  db.run(sql, [clicked_product_id, searchId], function(err) {
    if (err) {
      logger.error('Error updating clicked product', err);
      return res.status(500).json({ error: 'Failed to update clicked product' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Search not found' });
    }

    res.json({ message: 'Clicked product updated successfully' });
  });
};

// Get search analytics
exports.getSearchAnalytics = async (req, res) => {
  const { days = 30 } = req.query;
  const db = req.app.locals.db;

  const queries = {
    totalSearches: `
      SELECT COUNT(*) as total
      FROM search_history
      WHERE created_at >= datetime('now', '-' || ? || ' days')
    `,
    avgResultsCount: `
      SELECT AVG(results_count) as avg_results
      FROM search_history
      WHERE created_at >= datetime('now', '-' || ? || ' days')
    `,
    clickThroughRate: `
      SELECT 
        COUNT(CASE WHEN clicked_product_id IS NOT NULL THEN 1 END) * 100.0 / COUNT(*) as ctr
      FROM search_history
      WHERE created_at >= datetime('now', '-' || ? || ' days')
    `,
    zeroResultSearches: `
      SELECT COUNT(*) as zero_results
      FROM search_history
      WHERE results_count = 0 AND created_at >= datetime('now', '-' || ? || ' days')
    `
  };

  const analytics = {};
  const promises = Object.entries(queries).map(([key, sql]) => {
    return new Promise((resolve, reject) => {
      db.get(sql, [parseInt(days)], (err, row) => {
        if (err) reject(err);
        else {
          analytics[key] = Object.values(row)[0];
          resolve();
        }
      });
    });
  });

  try {
    await Promise.all(promises);
    res.json({ analytics, period_days: parseInt(days) });
  } catch (err) {
    logger.error('Error fetching search analytics', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};
