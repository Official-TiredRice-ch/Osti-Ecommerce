const express = require('express');
const router = express.Router();
const wishlistController = require('../controller/wishlistController');
const { authenticate, authorizeOwner } = require('../middleware/auth');
const { logAction } = require('../middleware/auditLogger');

// All wishlist routes require authentication
router.use(authenticate);

// Add to wishlist
router.post('/', logAction('wishlist_add', 'wishlist'), wishlistController.addToWishlist);

// Get user's wishlist
router.get('/user/:userId', authorizeOwner, wishlistController.getUserWishlist);

// Get wishlist statistics
router.get('/user/:userId/stats', authorizeOwner, wishlistController.getWishlistStats);

// Check if product is in wishlist
router.get('/user/:userId/product/:productId', authorizeOwner, wishlistController.checkWishlistItem);

// Remove from wishlist by wishlist ID
router.delete('/:wishlistId', logAction('wishlist_remove', 'wishlist'), wishlistController.removeFromWishlist);

// Remove from wishlist by user and product
router.delete('/user/:userId/product/:productId', authorizeOwner, logAction('wishlist_remove', 'wishlist'), wishlistController.removeFromWishlistByProduct);

// Clear entire wishlist
router.delete('/user/:userId/clear', authorizeOwner, logAction('wishlist_clear', 'wishlist'), wishlistController.clearWishlist);

module.exports = router;
