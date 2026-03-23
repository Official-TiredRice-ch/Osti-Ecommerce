const express = require('express');
const router = express.Router();
const biodataController = require('../controller/biodataController');
const { authenticate, authorize, authorizeOwner } = require('../middleware/auth');
const { logAction } = require('../middleware/auditLogger');

// All routes require authentication
router.use(authenticate);

// Create or update biodata
router.post('/', logAction('biodata_upsert', 'biodata'), biodataController.upsertBiodata);

// Get biodata by user ID (user can only access their own, admin can access any)
router.get('/user/:userId', authorizeOwner, biodataController.getBiodataByUserId);

// Delete biodata (user can only delete their own, admin can delete any)
router.delete('/user/:userId', authorizeOwner, logAction('biodata_delete', 'biodata'), biodataController.deleteBiodata);

// Admin only routes
router.get('/', authorize('admin'), biodataController.getAllBiodata);
router.get('/stats', authorize('admin'), biodataController.getBiodataStats);

module.exports = router;
