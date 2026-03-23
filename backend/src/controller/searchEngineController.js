const logger = require('../../utils/logger');

// Create a new search engine configuration
exports.createSearchEngine = (req, res) => {
  const { name, base_url, api_key, provider, is_active = 1 } = req.body;
  const db = req.app.locals.db;

  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }

  const sql = `
    INSERT INTO search_engines (name, base_url, api_key, provider, is_active)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [name, base_url || null, api_key || null, provider || null, is_active], function(err) {
    if (err) {
      logger.error('Error creating search engine', err);
      return res.status(500).json({ error: 'Failed to create search engine' });
    }

    res.status(201).json({
      message: 'Search engine created successfully',
      id: this.lastID
    });
  });
};

// Get all search engines
exports.getAllSearchEngines = (req, res) => {
  const { is_active, provider } = req.query;
  const db = req.app.locals.db;

  let sql = `SELECT * FROM search_engines WHERE 1=1`;
  const params = [];

  if (is_active !== undefined) {
    sql += ` AND is_active = ?`;
    params.push(parseInt(is_active));
  }

  if (provider) {
    sql += ` AND provider = ?`;
    params.push(provider);
  }

  sql += ` ORDER BY created_at DESC`;

  db.all(sql, params, (err, engines) => {
    if (err) {
      logger.error('Error fetching search engines', err);
      return res.status(500).json({ error: 'Failed to fetch search engines' });
    }

    // Mask API keys in response
    const maskedEngines = engines.map(engine => ({
      ...engine,
      api_key: engine.api_key ? '***masked***' : null
    }));

    res.json({ search_engines: maskedEngines, count: maskedEngines.length });
  });
};

// Get search engine by ID
exports.getSearchEngineById = (req, res) => {
  const { engineId } = req.params;
  const db = req.app.locals.db;

  const sql = `SELECT * FROM search_engines WHERE id = ?`;

  db.get(sql, [engineId], (err, engine) => {
    if (err) {
      logger.error('Error fetching search engine', err);
      return res.status(500).json({ error: 'Failed to fetch search engine' });
    }

    if (!engine) {
      return res.status(404).json({ error: 'Search engine not found' });
    }

    // Mask API key in response
    engine.api_key = engine.api_key ? '***masked***' : null;

    res.json({ search_engine: engine });
  });
};

// Get active search engine
exports.getActiveSearchEngine = (req, res) => {
  const db = req.app.locals.db;

  const sql = `SELECT * FROM search_engines WHERE is_active = 1 ORDER BY created_at DESC LIMIT 1`;

  db.get(sql, [], (err, engine) => {
    if (err) {
      logger.error('Error fetching active search engine', err);
      return res.status(500).json({ error: 'Failed to fetch active search engine' });
    }

    if (!engine) {
      return res.status(404).json({ error: 'No active search engine found' });
    }

    res.json({ search_engine: engine });
  });
};

// Update search engine
exports.updateSearchEngine = (req, res) => {
  const { engineId } = req.params;
  const { name, base_url, api_key, provider, is_active } = req.body;
  const db = req.app.locals.db;

  const updates = [];
  const params = [];

  if (name) {
    updates.push('name = ?');
    params.push(name);
  }
  if (base_url !== undefined) {
    updates.push('base_url = ?');
    params.push(base_url);
  }
  if (api_key !== undefined) {
    updates.push('api_key = ?');
    params.push(api_key);
  }
  if (provider !== undefined) {
    updates.push('provider = ?');
    params.push(provider);
  }
  if (is_active !== undefined) {
    updates.push('is_active = ?');
    params.push(parseInt(is_active));
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  params.push(engineId);
  const sql = `UPDATE search_engines SET ${updates.join(', ')} WHERE id = ?`;

  db.run(sql, params, function(err) {
    if (err) {
      logger.error('Error updating search engine', err);
      return res.status(500).json({ error: 'Failed to update search engine' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Search engine not found' });
    }

    res.json({ message: 'Search engine updated successfully' });
  });
};

// Toggle search engine active status
exports.toggleSearchEngine = (req, res) => {
  const { engineId } = req.params;
  const db = req.app.locals.db;

  const sql = `UPDATE search_engines SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END WHERE id = ?`;

  db.run(sql, [engineId], function(err) {
    if (err) {
      logger.error('Error toggling search engine', err);
      return res.status(500).json({ error: 'Failed to toggle search engine' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Search engine not found' });
    }

    res.json({ message: 'Search engine status toggled successfully' });
  });
};

// Delete search engine
exports.deleteSearchEngine = (req, res) => {
  const { engineId } = req.params;
  const db = req.app.locals.db;

  const sql = `DELETE FROM search_engines WHERE id = ?`;

  db.run(sql, [engineId], function(err) {
    if (err) {
      logger.error('Error deleting search engine', err);
      return res.status(500).json({ error: 'Failed to delete search engine' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Search engine not found' });
    }

    res.json({ message: 'Search engine deleted successfully' });
  });
};
