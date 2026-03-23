const express = require('express');
const router = express.Router();
const searchEngineController = require('../controller/searchEngineController');
const { authenticate, authorize } = require('../middleware/auth');
const { logAction } = require('../middleware/auditLogger');

// Public route - get active search engine
router.get('/active', searchEngineController.getActiveSearchEngine);

// Protected routes - admin only
router.use(authenticate);
router.use(authorize('admin'));

// CRUD operations
router.post('/', logAction('search_engine_create', 'search_engine'), searchEngineController.createSearchEngine);
router.get('/', searchEngineController.getAllSearchEngines);
router.get('/:engineId', searchEngineController.getSearchEngineById);
router.patch('/:engineId', logAction('search_engine_update', 'search_engine'), searchEngineController.updateSearchEngine);
router.patch('/:engineId/toggle', logAction('search_engine_toggle', 'search_engine'), searchEngineController.toggleSearchEngine);
router.delete('/:engineId', logAction('search_engine_delete', 'search_engine'), searchEngineController.deleteSearchEngine);

module.exports = router;
