const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { authenticate, authorize, authorizeOwner } = require('../middleware/auth');
const { validateEmail, validatePassword, validateRole, validateStatus } = require('../middleware/validation');
const { logAction } = require('../middleware/auditLogger');

// Authentication (public routes)
router.post('/register', validateEmail, validatePassword, validateRole, logAction('user_register', 'user'), userController.register);
router.post('/login', validateEmail, logAction('user_login', 'user'), userController.login);

// User management (protected routes)
router.get('/', authenticate, authorize('admin', 'staff'), userController.getAllUsers);
router.get('/:userId', authenticate, authorizeOwner, userController.getUserById);
router.patch('/:userId', authenticate, authorizeOwner, validateEmail, validateRole, validateStatus, logAction('user_update', 'user'), userController.updateUser);
router.delete('/:userId', authenticate, authorize('admin'), logAction('user_delete', 'user'), userController.deleteUser);

// Password management (protected routes)
router.post('/:userId/change-password', authenticate, authorizeOwner, validatePassword, logAction('password_change', 'user'), userController.changePassword);

module.exports = router;
