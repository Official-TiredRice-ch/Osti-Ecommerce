const logger = require('../../utils/logger');

// Add product to wishlist
exports.addToWishlist = (req, res) => {
  const { user_id, product_id } = req.body;
  const db = req.app.locals.db;

  if (!user_id || !product_id) {
    return res.status(400).json({ error: 'user_id and product_id are required' });
  }

  const sql = `
    INSERT INTO wishlist (user_id, product_id)
    VALUES (?, ?)
  `;

  db.run(sql, [user_id, product_id], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(409).json({ error: 'Product already in wishlist' });
      }
      if (err.message.includes('FOREIGN KEY')) {
        return res.status(404).json({ error: 'User or product not found' });
      }
      logger.error('Error adding to wishlist', err);
      return res.status(500).json({ error: 'Failed to add to wishlist' });
    }

    res.status(201).json({
      message: 'Product added to wishlist successfully',
      id: this.lastID
    });
  });
};

// Get user's wishlist
exports.getUserWishlist = (req, res) => {
  const { userId } = req.params;
  const db = req.app.locals.db;

  const sql = `
    SELECT w.id, w.user_id, w.product_id, w.created_at,
           p.name as product_name, p.description as product_description, 
           p.price, p.stock,
           c.name as category_name
    FROM wishlist w
    JOIN products p ON w.product_id = p.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE w.user_id = ?
    ORDER BY w.created_at DESC
  `;

  db.all(sql, [userId], (err, items) => {
    if (err) {
      logger.error('Error fetching wishlist', err);
      return res.status(500).json({ error: 'Failed to fetch wishlist' });
    }

    res.json({ wishlist: items, count: items.length });
  });
};

// Check if product is in user's wishlist
exports.checkWishlistItem = (req, res) => {
  const { userId, productId } = req.params;
  const db = req.app.locals.db;

  const sql = `SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?`;

  db.get(sql, [userId, productId], (err, item) => {
    if (err) {
      logger.error('Error checking wishlist item', err);
      return res.status(500).json({ error: 'Failed to check wishlist' });
    }

    res.json({ in_wishlist: !!item, wishlist_id: item ? item.id : null });
  });
};

// Remove product from wishlist
exports.removeFromWishlist = (req, res) => {
  const { wishlistId } = req.params;
  const db = req.app.locals.db;

  const sql = `DELETE FROM wishlist WHERE id = ?`;

  db.run(sql, [wishlistId], function(err) {
    if (err) {
      logger.error('Error removing from wishlist', err);
      return res.status(500).json({ error: 'Failed to remove from wishlist' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Wishlist item not found' });
    }

    res.json({ message: 'Product removed from wishlist successfully' });
  });
};

// Remove product from wishlist by user_id and product_id
exports.removeFromWishlistByProduct = (req, res) => {
  const { userId, productId } = req.params;
  const db = req.app.locals.db;

  const sql = `DELETE FROM wishlist WHERE user_id = ? AND product_id = ?`;

  db.run(sql, [userId, productId], function(err) {
    if (err) {
      logger.error('Error removing from wishlist', err);
      return res.status(500).json({ error: 'Failed to remove from wishlist' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Wishlist item not found' });
    }

    res.json({ message: 'Product removed from wishlist successfully' });
  });
};

// Clear user's entire wishlist
exports.clearWishlist = (req, res) => {
  const { userId } = req.params;
  const db = req.app.locals.db;

  const sql = `DELETE FROM wishlist WHERE user_id = ?`;

  db.run(sql, [userId], function(err) {
    if (err) {
      logger.error('Error clearing wishlist', err);
      return res.status(500).json({ error: 'Failed to clear wishlist' });
    }

    res.json({ 
      message: 'Wishlist cleared successfully',
      deleted_count: this.changes
    });
  });
};

// Get wishlist statistics for a user
exports.getWishlistStats = (req, res) => {
  const { userId } = req.params;
  const db = req.app.locals.db;

  const sql = `
    SELECT 
      COUNT(*) as total_items,
      SUM(p.price) as total_value,
      AVG(p.price) as avg_price,
      COUNT(CASE WHEN p.stock > 0 THEN 1 END) as in_stock_count,
      COUNT(CASE WHEN p.stock = 0 THEN 1 END) as out_of_stock_count
    FROM wishlist w
    JOIN products p ON w.product_id = p.id
    WHERE w.user_id = ?
  `;

  db.get(sql, [userId], (err, stats) => {
    if (err) {
      logger.error('Error fetching wishlist stats', err);
      return res.status(500).json({ error: 'Failed to fetch wishlist statistics' });
    }

    res.json({ stats });
  });
};
