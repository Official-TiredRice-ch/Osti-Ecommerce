const logger = require('../../utils/logger');

// Create a new category
exports.createCategory = (req, res) => {
  const { name, description, parent_id } = req.body;
  const db = req.app.locals.db;

  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }

  const sql = `
    INSERT INTO categories (name, description, parent_id)
    VALUES (?, ?, ?)
  `;

  db.run(sql, [name, description || null, parent_id || null], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(409).json({ error: 'Category name already exists' });
      }
      logger.error('Error creating category', err);
      return res.status(500).json({ error: 'Failed to create category' });
    }

    res.status(201).json({
      message: 'Category created successfully',
      id: this.lastID
    });
  });
};

// Get all categories
exports.getAllCategories = (req, res) => {
  const { parent_id } = req.query;
  const db = req.app.locals.db;

  let sql = `
    SELECT c.*, 
           p.name as parent_name,
           (SELECT COUNT(*) FROM categories WHERE parent_id = c.id) as subcategory_count
    FROM categories c
    LEFT JOIN categories p ON c.parent_id = p.id
  `;
  const params = [];

  if (parent_id !== undefined) {
    if (parent_id === 'null' || parent_id === '') {
      sql += ` WHERE c.parent_id IS NULL`;
    } else {
      sql += ` WHERE c.parent_id = ?`;
      params.push(parseInt(parent_id));
    }
  }

  sql += ` ORDER BY c.name ASC`;

  db.all(sql, params, (err, categories) => {
    if (err) {
      logger.error('Error fetching categories', err);
      return res.status(500).json({ error: 'Failed to fetch categories' });
    }

    res.json({ categories, count: categories.length });
  });
};

// Get category by ID
exports.getCategoryById = (req, res) => {
  const { categoryId } = req.params;
  const db = req.app.locals.db;

  const sql = `
    SELECT c.*, 
           p.name as parent_name,
           (SELECT COUNT(*) FROM categories WHERE parent_id = c.id) as subcategory_count
    FROM categories c
    LEFT JOIN categories p ON c.parent_id = p.id
    WHERE c.id = ?
  `;

  db.get(sql, [categoryId], (err, category) => {
    if (err) {
      logger.error('Error fetching category', err);
      return res.status(500).json({ error: 'Failed to fetch category' });
    }

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ category });
  });
};

// Get category tree (hierarchical structure)
exports.getCategoryTree = (req, res) => {
  const db = req.app.locals.db;

  const sql = `SELECT * FROM categories ORDER BY parent_id, name`;

  db.all(sql, [], (err, categories) => {
    if (err) {
      logger.error('Error fetching category tree', err);
      return res.status(500).json({ error: 'Failed to fetch category tree' });
    }

    // Build tree structure
    const categoryMap = {};
    const tree = [];

    // First pass: create map
    categories.forEach(cat => {
      categoryMap[cat.id] = { ...cat, children: [] };
    });

    // Second pass: build tree
    categories.forEach(cat => {
      if (cat.parent_id === null) {
        tree.push(categoryMap[cat.id]);
      } else if (categoryMap[cat.parent_id]) {
        categoryMap[cat.parent_id].children.push(categoryMap[cat.id]);
      }
    });

    res.json({ tree });
  });
};

// Get subcategories of a category
exports.getSubcategories = (req, res) => {
  const { categoryId } = req.params;
  const db = req.app.locals.db;

  const sql = `
    SELECT c.*,
           (SELECT COUNT(*) FROM categories WHERE parent_id = c.id) as subcategory_count
    FROM categories c
    WHERE c.parent_id = ?
    ORDER BY c.name ASC
  `;

  db.all(sql, [categoryId], (err, subcategories) => {
    if (err) {
      logger.error('Error fetching subcategories', err);
      return res.status(500).json({ error: 'Failed to fetch subcategories' });
    }

    res.json({ subcategories, count: subcategories.length });
  });
};

// Update category
exports.updateCategory = (req, res) => {
  const { categoryId } = req.params;
  const { name, description, parent_id } = req.body;
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
  if (parent_id !== undefined) {
    // Prevent circular reference
    if (parent_id == categoryId) {
      return res.status(400).json({ error: 'Category cannot be its own parent' });
    }
    updates.push('parent_id = ?');
    params.push(parent_id || null);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  params.push(categoryId);
  const sql = `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`;

  db.run(sql, params, function(err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(409).json({ error: 'Category name already exists' });
      }
      logger.error('Error updating category', err);
      return res.status(500).json({ error: 'Failed to update category' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category updated successfully' });
  });
};

// Delete category
exports.deleteCategory = (req, res) => {
  const { categoryId } = req.params;
  const db = req.app.locals.db;

  // Check if category has subcategories
  const checkSql = `SELECT COUNT(*) as count FROM categories WHERE parent_id = ?`;

  db.get(checkSql, [categoryId], (err, result) => {
    if (err) {
      logger.error('Error checking subcategories', err);
      return res.status(500).json({ error: 'Failed to delete category' });
    }

    if (result.count > 0) {
      return res.status(400).json({ error: 'Cannot delete category with subcategories' });
    }

    const sql = `DELETE FROM categories WHERE id = ?`;

    db.run(sql, [categoryId], function(err) {
      if (err) {
        logger.error('Error deleting category', err);
        return res.status(500).json({ error: 'Failed to delete category' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }

      res.json({ message: 'Category deleted successfully' });
    });
  });
};
