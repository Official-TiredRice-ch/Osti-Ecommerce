const logger = require('../../utils/logger');

// Create or update biodata for a user
exports.upsertBiodata = (req, res) => {
  const { user_id, first_name, last_name, middle_name, phone, address, date_of_birth, gender } = req.body;
  const db = req.app.locals.db;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  // Check if biodata already exists
  const checkSql = `SELECT id FROM biodata WHERE user_id = ?`;

  db.get(checkSql, [user_id], (err, existing) => {
    if (err) {
      logger.error('Error checking biodata', err);
      return res.status(500).json({ error: 'Failed to process biodata' });
    }

    if (existing) {
      // Update existing biodata
      const updates = [];
      const params = [];

      if (first_name !== undefined) {
        updates.push('first_name = ?');
        params.push(first_name);
      }
      if (last_name !== undefined) {
        updates.push('last_name = ?');
        params.push(last_name);
      }
      if (middle_name !== undefined) {
        updates.push('middle_name = ?');
        params.push(middle_name);
      }
      if (phone !== undefined) {
        updates.push('phone = ?');
        params.push(phone);
      }
      if (address !== undefined) {
        updates.push('address = ?');
        params.push(address);
      }
      if (date_of_birth !== undefined) {
        updates.push('date_of_birth = ?');
        params.push(date_of_birth);
      }
      if (gender !== undefined) {
        updates.push('gender = ?');
        params.push(gender);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      params.push(user_id);
      const updateSql = `UPDATE biodata SET ${updates.join(', ')} WHERE user_id = ?`;

      db.run(updateSql, params, function(err) {
        if (err) {
          logger.error('Error updating biodata', err);
          return res.status(500).json({ error: 'Failed to update biodata' });
        }

        res.json({ message: 'Biodata updated successfully' });
      });
    } else {
      // Create new biodata
      const insertSql = `
        INSERT INTO biodata (user_id, first_name, last_name, middle_name, phone, address, date_of_birth, gender)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.run(insertSql, [user_id, first_name || null, last_name || null, middle_name || null, phone || null, address || null, date_of_birth || null, gender || null], function(err) {
        if (err) {
          if (err.message.includes('FOREIGN KEY')) {
            return res.status(404).json({ error: 'User not found' });
          }
          logger.error('Error creating biodata', err);
          return res.status(500).json({ error: 'Failed to create biodata' });
        }

        res.status(201).json({
          message: 'Biodata created successfully',
          id: this.lastID
        });
      });
    }
  });
};

// Get biodata by user ID
exports.getBiodataByUserId = (req, res) => {
  const { userId } = req.params;
  const db = req.app.locals.db;

  const sql = `
    SELECT b.*, u.username, u.email
    FROM biodata b
    JOIN users u ON b.user_id = u.id
    WHERE b.user_id = ?
  `;

  db.get(sql, [userId], (err, biodata) => {
    if (err) {
      logger.error('Error fetching biodata', err);
      return res.status(500).json({ error: 'Failed to fetch biodata' });
    }

    if (!biodata) {
      return res.status(404).json({ error: 'Biodata not found' });
    }

    res.json({ biodata });
  });
};

// Get all biodata (admin only)
exports.getAllBiodata = (req, res) => {
  const { gender, limit = 50, offset = 0 } = req.query;
  const db = req.app.locals.db;

  let sql = `
    SELECT b.*, u.username, u.email, u.role
    FROM biodata b
    JOIN users u ON b.user_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (gender) {
    sql += ` AND b.gender = ?`;
    params.push(gender);
  }

  sql += ` ORDER BY b.created_at DESC LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), parseInt(offset));

  db.all(sql, params, (err, biodataList) => {
    if (err) {
      logger.error('Error fetching biodata list', err);
      return res.status(500).json({ error: 'Failed to fetch biodata' });
    }

    res.json({ biodata: biodataList, count: biodataList.length });
  });
};

// Delete biodata
exports.deleteBiodata = (req, res) => {
  const { userId } = req.params;
  const db = req.app.locals.db;

  const sql = `DELETE FROM biodata WHERE user_id = ?`;

  db.run(sql, [userId], function(err) {
    if (err) {
      logger.error('Error deleting biodata', err);
      return res.status(500).json({ error: 'Failed to delete biodata' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Biodata not found' });
    }

    res.json({ message: 'Biodata deleted successfully' });
  });
};

// Get biodata statistics (admin only)
exports.getBiodataStats = (req, res) => {
  const db = req.app.locals.db;

  const queries = {
    totalProfiles: `SELECT COUNT(*) as total FROM biodata`,
    genderBreakdown: `
      SELECT gender, COUNT(*) as count
      FROM biodata
      WHERE gender IS NOT NULL
      GROUP BY gender
    `,
    completionRate: `
      SELECT 
        COUNT(CASE WHEN first_name IS NOT NULL AND last_name IS NOT NULL AND phone IS NOT NULL THEN 1 END) * 100.0 / COUNT(*) as completion_rate
      FROM biodata
    `,
    recentProfiles: `
      SELECT COUNT(*) as recent_count
      FROM biodata
      WHERE created_at >= datetime('now', '-30 days')
    `
  };

  const stats = {};
  let completed = 0;
  const total = Object.keys(queries).length;

  Object.entries(queries).forEach(([key, sql]) => {
    db.all(sql, [], (err, rows) => {
      if (err) {
        logger.error(`Error fetching ${key}`, err);
        stats[key] = null;
      } else {
        stats[key] = key === 'genderBreakdown' ? rows : (rows[0] ? Object.values(rows[0])[0] : 0);
      }

      completed++;
      if (completed === total) {
        res.json({ stats });
      }
    });
  });
};
