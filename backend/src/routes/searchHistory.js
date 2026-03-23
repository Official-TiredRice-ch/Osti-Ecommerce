const express = require('express');
const router = express.Router();
const searchHistoryController = require('../controller/searchHistoryController');

// Log a search
router.post('/', searchHistoryController.logSearch);

// Get user search history
router.get('/user/:userId', searchHistoryController.getUserSearchHistory);

// Get popular searches
router.get('/popular', searchHistoryController.getPopularSearches);

// Get search analytics
router.get('/analytics', searchHistoryController.getSearchAnalytics);

// Update clicked product for a search
router.patch('/:searchId/click', searchHistoryController.updateClickedProduct);

module.exports = router;
