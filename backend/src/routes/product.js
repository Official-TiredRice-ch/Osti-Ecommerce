const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const { authenticate, authorize } = require('../middleware/auth');
const { logAction } = require('../middleware/auditLogger');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/stats', productController.getProductStats);
router.get('/category/:categoryId', productController.getProductsByCategory);
router.get('/:productId', productController.getProductById);

// Protected routes - admin and staff only
router.post('/', authenticate, authorize('admin', 'staff'), logAction('product_create', 'product'), productController.createProduct);
router.patch('/:productId', authenticate, authorize('admin', 'staff'), logAction('product_update', 'product'), productController.updateProduct);
router.patch('/:productId/stock', authenticate, authorize('admin', 'staff'), logAction('product_stock_update', 'product'), productController.updateStock);
router.delete('/:productId', authenticate, authorize('admin'), logAction('product_delete', 'product'), productController.deleteProduct);

module.exports = router;
