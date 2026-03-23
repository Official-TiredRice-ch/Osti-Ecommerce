const express = require('express');
const router = express.Router();
const auditController = require('../controller/auditController');
const { authenticate, authorize } = require('../middleware/auth');

// All audit routes require admin access
router.use(authenticate);
router.use(authorize('admin'));

// Log audit entry
router.post('/', auditController.logAudit);

// Get audit logs with filters
router.get('/', auditController.getAuditLogs);

// Get audit logs for a specific user
router.get('/user/:userId', auditController.getUserAuditLogs);

// Get audit logs for a specific entity
router.get('/entity/:entity/:entityId', auditController.getEntityAuditLogs);

// Get audit statistics
router.get('/stats', auditController.getAuditStats);

// Cleanup old audit logs
router.delete('/cleanup', auditController.cleanupAuditLogs);

module.exports = router;
