const SearchService = require('../services/searchService');

/**
 * Search Controller - Handles product search requests
 */

// Search products
exports.searchProducts = async (req, res) => {
  try {
    const { query, minPrice, maxPrice, categoryId, inStock, sortBy, page, limit } = req.query;
    const userId = req.user?.id;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const filters = {
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      inStock: inStock === 'true',
      sortBy: sortBy || 'relevance',
      page: page ? parseInt(page) : 0,
      limit: limit ? parseInt(limit) : 20,
    };

    const db = req.app.locals.db;
    const results = await SearchService.searchProducts(db, query, filters);

    // Log search query (non-blocking)
    try {
      await SearchService.logSearchQuery(db, userId, query, results.length);
    } catch (logError) {
      console.warn('Could not log search query:', logError.message);
    }

    res.json({
      query,
      resultCount: results.length,
      results,
      filters,
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get search suggestions
exports.getSearchSuggestions = async (req, res) => {
  try {
    const { query, limit } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const db = req.app.locals.db;
    const suggestions = await SearchService.getSearchSuggestions(db, query, limit ? parseInt(limit) : 10);

    res.json({ suggestions });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get trending searches
exports.getTrendingSearches = async (req, res) => {
  try {
    const { limit } = req.query;
    const db = req.app.locals.db;
    
    try {
      const trending = await SearchService.getTrendingSearches(db, limit ? parseInt(limit) : 10);
      res.json({ trending });
    } catch (err) {
      // If table doesn't exist, return empty
      console.warn('Trending searches not available:', err.message);
      res.json({ trending: [] });
    }
  } catch (error) {
    console.error('Trending error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Build external search query
exports.buildExternalSearchQuery = (req, res) => {
  try {
    const { query, location, sites } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const externalQuery = SearchService.buildExternalSearchQuery(
      query,
      location || 'Cebu',
      sites || ['shopee.ph', 'lazada.com.ph']
    );

    res.json({
      originalQuery: query,
      externalSearchQuery: externalQuery,
      location: location || 'Cebu',
      sites: sites || ['shopee.ph', 'lazada.com.ph'],
    });
  } catch (error) {
    console.error('Build query error:', error);
    res.status(400).json({ error: error.message });
  }
};

// Get search history
exports.getSearchHistory = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { limit } = req.query;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const db = req.app.locals.db;
    const sql = `
      SELECT * FROM search_history
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `;

    db.all(sql, [userId, limit ? parseInt(limit) : 20], (err, rows) => {
      if (err) {
        console.warn('Search history not available:', err.message);
        return res.json({ history: [] });
      }
      res.json({ history: rows || [] });
    });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: error.message });
  }
};
