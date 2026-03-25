const express = require('express');
const router = express.Router();
const searchController = require('../controller/searchController');
const { authenticate } = require('../middleware/auth');
const { logAction } = require('../middleware/auditLogger');

// Public routes
router.get('/products', logAction('product_search', 'search'), searchController.searchProducts);
router.get('/suggestions', searchController.getSearchSuggestions);
router.get('/trending', searchController.getTrendingSearches);
router.post('/build-external-query', searchController.buildExternalSearchQuery);

// Protected routes
router.get('/history', authenticate, searchController.getSearchHistory);

module.exports = router;
