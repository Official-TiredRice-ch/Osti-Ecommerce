/**
 * Search Service - Handles product search with advanced query building
 */

class SearchService {
  /**
   * Build advanced search query for external search engines
   * Example: "laptop" -> "laptop Cebu price site:shopee.ph OR site:lazada.com.ph"
   */
  static buildExternalSearchQuery(query, location = 'Cebu', sites = ['shopee.ph', 'lazada.com.ph']) {
    if (!query || query.trim().length === 0) {
      throw new Error('Search query cannot be empty');
    }

    const cleanQuery = query.trim();
    const siteFilters = sites.map(site => `site:${site}`).join(' OR ');
    
    return `"${cleanQuery}" ${location} price ${siteFilters}`;
  }

  /**
   * Search products in database by name, description, or category
   */
  static async searchProducts(db, query, filters = {}) {
    return new Promise((resolve, reject) => {
      if (!query || query.trim().length === 0) {
        reject(new Error('Search query cannot be empty'));
        return;
      }

      const searchTerm = `%${query.trim()}%`;
      let sql = `
        SELECT p.*, c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ?
      `;
      let params = [searchTerm, searchTerm, searchTerm];

      // Apply filters
      if (filters.minPrice !== undefined) {
        sql += ' AND p.price >= ?';
        params.push(filters.minPrice);
      }

      if (filters.maxPrice !== undefined) {
        sql += ' AND p.price <= ?';
        params.push(filters.maxPrice);
      }

      if (filters.categoryId) {
        sql += ' AND p.category_id = ?';
        params.push(filters.categoryId);
      }

      if (filters.inStock === true) {
        sql += ' AND p.stock > 0';
      }

      // Add sorting
      const sortBy = filters.sortBy || 'relevance';
      switch (sortBy) {
        case 'price_asc':
          sql += ' ORDER BY p.price ASC';
          break;
        case 'price_desc':
          sql += ' ORDER BY p.price DESC';
          break;
        case 'newest':
          sql += ' ORDER BY p.created_at DESC';
          break;
        case 'rating':
          sql += ' ORDER BY p.rating DESC';
          break;
        default:
          sql += ' ORDER BY p.name ASC';
      }

      // Add limit
      const limit = filters.limit || 20;
      const offset = (filters.page || 0) * limit;
      sql += ` LIMIT ? OFFSET ?`;
      params.push(limit, offset);

      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  /**
   * Get search suggestions based on partial query
   */
  static async getSearchSuggestions(db, query, limit = 10) {
    return new Promise((resolve, reject) => {
      if (!query || query.trim().length === 0) {
        resolve([]);
        return;
      }

      const searchTerm = `${query.trim()}%`;
      const sql = `
        SELECT DISTINCT name as suggestion
        FROM products
        WHERE name LIKE ?
        LIMIT ?
      `;

      db.all(sql, [searchTerm, limit], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows?.map(r => r.suggestion) || []);
        }
      });
    });
  }

  /**
   * Get trending searches
   */
  static async getTrendingSearches(db, limit = 10) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT query, COUNT(*) as count
        FROM search_history
        WHERE created_at > datetime('now', '-7 days')
        GROUP BY query
        ORDER BY count DESC
        LIMIT ?
      `;

      db.all(sql, [limit], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  /**
   * Log search query to history
   */
  static async logSearchQuery(db, userId, query, resultCount) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO search_history (user_id, query, result_count, created_at)
        VALUES (?, ?, ?, datetime('now'))
      `;

      db.run(sql, [userId || null, query, resultCount], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      });
    });
  }
}

module.exports = SearchService;
