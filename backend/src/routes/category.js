const express = require('express');
const router = express.Router();
const categoryController = require('../controller/categoryController');
const { authenticate, authorize } = require('../middleware/auth');
const { logAction } = require('../middleware/auditLogger');

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/tree', categoryController.getCategoryTree);
router.get('/:categoryId', categoryController.getCategoryById);
router.get('/:categoryId/subcategories', categoryController.getSubcategories);

// Protected routes - admin and staff only
router.post('/', authenticate, authorize('admin', 'staff'), logAction('category_create', 'category'), categoryController.createCategory);
router.patch('/:categoryId', authenticate, authorize('admin', 'staff'), logAction('category_update', 'category'), categoryController.updateCategory);
router.delete('/:categoryId', authenticate, authorize('admin'), logAction('category_delete', 'category'), categoryController.deleteCategory);

module.exports = router;
