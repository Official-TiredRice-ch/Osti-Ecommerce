const logger = require('../../utils/logger');

// Create a new product
exports.createProduct = (req, res) => {
  const { name, description, price, stock = 0, category_id } = req.body;
  const db = req.app.locals.db;

  if (!name || !price) {
    return res.status(400).json({ error: 'name and price are required' });
  }

  if (price <= 0) {
    return res.status(400).json({ error: 'price must be greater than 0' });
  }

  if (stock < 0) {
    return res.status(400).json({ error: 'stock cannot be negative' });
  }

  const sql = `
    INSERT INTO products (name, description, price, stock, category_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [name, description || null, price, stock, category_id || null], function(err) {
    if (err) {
      if (err.message.includes('FOREIGN KEY')) {
        return res.status(404).json({ error: 'Category not found' });
      }
      logger.error('Error creating product', err);
      return res.status(500).json({ error: 'Failed to create product' });
    }

    res.status(201).json({
      message: 'Product created successfully',
      id: this.lastID
    });
  });
};

// Get all products with filters
exports.getAllProducts = (req, res) => {
  const { category_id, min_price, max_price, in_stock, search, limit = 50, offset = 0, sort = 'created_at', order = 'DESC' } = req.query;
  const db = req.app.locals.db;

  let sql = `
    SELECT p.*, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE 1=1
  `;
  const params = [];

  if (category_id) {
    sql += ` AND p.category_id = ?`;
    params.push(parseInt(category_id));
  }

  if (min_price) {
    sql += ` AND p.price >= ?`;
    params.push(parseFloat(min_price));
  }

  if (max_price) {
    sql += ` AND p.price <= ?`;
    params.push(parseFloat(max_price));
  }

  if (in_stock === 'true') {
    sql += ` AND p.stock > 0`;
  }

  if (search) {
    sql += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm);
  }

  // Validate sort column
  const validSortColumns = ['name', 'price', 'stock', 'created_at'];
  const sortColumn = validSortColumns.includes(sort) ? sort : 'created_at';
  const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  sql += ` ORDER BY p.${sortColumn} ${sortOrder} LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), parseInt(offset));

  db.all(sql, params, (err, products) => {
    if (err) {
      logger.error('Error fetching products', err);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }

    res.json({ products, count: products.length });
  });
};

// Get product by ID
exports.getProductById = (req, res) => {
  const { productId } = req.params;
  const db = req.app.locals.db;

  const sql = `
    SELECT p.*, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `;

  db.get(sql, [productId], (err, product) => {
    if (err) {
      logger.error('Error fetching product', err);
      return res.status(500).json({ error: 'Failed to fetch product' });
    }

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  });
};

// Update product
exports.updateProduct = (req, res) => {
  const { productId } = req.params;
  const { name, description, price, stock, category_id } = req.body;
  const db = req.app.locals.db;

  const updates = [];
  const params = [];

  if (name) {
    updates.push('name = ?');
    params.push(name);
  }
  if (description !== undefined) {
    updates.push('description = ?');
    params.push(description);
  }
  if (price !== undefined) {
    if (price <= 0) {
      return res.status(400).json({ error: 'price must be greater than 0' });
    }
    updates.push('price = ?');
    params.push(price);
  }
  if (stock !== undefined) {
    if (stock < 0) {
      return res.status(400).json({ error: 'stock cannot be negative' });
    }
    updates.push('stock = ?');
    params.push(stock);
  }
  if (category_id !== undefined) {
    updates.push('category_id = ?');
    params.push(category_id || null);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  params.push(productId);
  const sql = `UPDATE products SET ${updates.join(', ')} WHERE id = ?`;

  db.run(sql, params, function(err) {
    if (err) {
      if (err.message.includes('FOREIGN KEY')) {
        return res.status(404).json({ error: 'Category not found' });
      }
      logger.error('Error updating product', err);
      return res.status(500).json({ error: 'Failed to update product' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully' });
  });
};

// Update product stock
exports.updateStock = (req, res) => {
  const { productId } = req.params;
  const { stock } = req.body;
  const db = req.app.locals.db;

  if (stock === undefined) {
    return res.status(400).json({ error: 'stock is required' });
  }

  if (stock < 0) {
    return res.status(400).json({ error: 'stock cannot be negative' });
  }

  const sql = `UPDATE products SET stock = ? WHERE id = ?`;

  db.run(sql, [stock, productId], function(err) {
    if (err) {
      logger.error('Error updating stock', err);
      return res.status(500).json({ error: 'Failed to update stock' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Stock updated successfully' });
  });
};

// Delete product
exports.deleteProduct = (req, res) => {
  const { productId } = req.params;
  const db = req.app.locals.db;

  const sql = `DELETE FROM products WHERE id = ?`;

  db.run(sql, [productId], function(err) {
    if (err) {
      logger.error('Error deleting product', err);
      return res.status(500).json({ error: 'Failed to delete product' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  });
};

// Get products by category
exports.getProductsByCategory = (req, res) => {
  const { categoryId } = req.params;
  const { limit = 50, offset = 0 } = req.query;
  const db = req.app.locals.db;

  const sql = `
    SELECT p.*, c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.category_id = ?
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?
  `;

  db.all(sql, [categoryId, parseInt(limit), parseInt(offset)], (err, products) => {
    if (err) {
      logger.error('Error fetching products by category', err);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }

    res.json({ products, count: products.length });
  });
};

// Get product statistics
exports.getProductStats = (req, res) => {
  const db = req.app.locals.db;

  const queries = {
    totalProducts: `SELECT COUNT(*) as total FROM products`,
    inStockCount: `SELECT COUNT(*) as count FROM products WHERE stock > 0`,
    outOfStockCount: `SELECT COUNT(*) as count FROM products WHERE stock = 0`,
    avgPrice: `SELECT AVG(price) as avg_price FROM products`,
    totalValue: `SELECT SUM(price * stock) as total_value FROM products`,
    categoryBreakdown: `
      SELECT c.name as category, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id, c.name
      ORDER BY product_count DESC
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
        stats[key] = key === 'categoryBreakdown' ? rows : (rows[0] ? Object.values(rows[0])[0] : 0);
      }

      completed++;
      if (completed === total) {
        res.json({ stats });
      }
    });
  });
};
