const { hashPassword, comparePassword } = require('../../utils/password');
const logger = require('../../utils/logger');

// Register a new user
exports.register = async (req, res) => {
  const { username, email, password, role = 'customer' } = req.body;
  const db = req.app.locals.db;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'username, email, and password are required' });
  }

  try {
    const password_hash = await hashPassword(password);
    
    const sql = `
      INSERT INTO users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `;

    db.run(sql, [username, email, password_hash, role], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(409).json({ error: 'Username or email already exists' });
        }
        logger.error('Error registering user', err);
        return res.status(500).json({ error: 'Failed to register user' });
      }

      res.status(201).json({
        message: 'User registered successfully',
        user: { id: this.lastID, username, email, role }
      });
    });
  } catch (err) {
    logger.error('Error hashing password', err);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const db = req.app.locals.db;

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const sql = `SELECT * FROM users WHERE email = ? COLLATE NOCASE`;

  db.get(sql, [email], async (err, user) => {
    if (err) {
      logger.error('Error during login', err);
      return res.status(500).json({ error: 'Login failed' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Account is disabled' });
    }

    try {
      const isValid = await comparePassword(password, user.password_hash);
      
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const { password_hash, ...userWithoutPassword } = user;
      res.json({
        message: 'Login successful',
        user: userWithoutPassword
      });
    } catch (err) {
      logger.error('Error comparing passwords', err);
      res.status(500).json({ error: 'Login failed' });
    }
  });
};

// Get user by ID
exports.getUserById = (req, res) => {
  const { userId } = req.params;
  const db = req.app.locals.db;

  const sql = `SELECT id, username, email, profile, role, status, created_at, updated_at FROM users WHERE id = ?`;

  db.get(sql, [userId], (err, user) => {
    if (err) {
      logger.error('Error fetching user', err);
      return res.status(500).json({ error: 'Failed to fetch user' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  });
};

// Get all users (admin only)
exports.getAllUsers = (req, res) => {
  const { role, status, limit = 50, offset = 0 } = req.query;
  const db = req.app.locals.db;

  let sql = `SELECT id, username, email, profile, role, status, created_at, updated_at FROM users WHERE 1=1`;
  const params = [];

  if (role) {
    sql += ` AND role = ?`;
    params.push(role);
  }

  if (status) {
    sql += ` AND status = ?`;
    params.push(status);
  }

  sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), parseInt(offset));

  db.all(sql, params, (err, users) => {
    if (err) {
      logger.error('Error fetching users', err);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }

    res.json({ users, count: users.length });
  });
};

// Update user
exports.updateUser = (req, res) => {
  const { userId } = req.params;
  const { username, email, profile, role, status } = req.body;
  const db = req.app.locals.db;

  const updates = [];
  const params = [];

  if (username) {
    updates.push('username = ?');
    params.push(username);
  }
  if (email) {
    updates.push('email = ?');
    params.push(email);
  }
  if (profile !== undefined) {
    updates.push('profile = ?');
    params.push(profile);
  }
  if (role) {
    updates.push('role = ?');
    params.push(role);
  }
  if (status) {
    updates.push('status = ?');
    params.push(status);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  params.push(userId);
  const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;

  db.run(sql, params, function(err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(409).json({ error: 'Username or email already exists' });
      }
      logger.error('Error updating user', err);
      return res.status(500).json({ error: 'Failed to update user' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User updated successfully' });
  });
};

// Delete user
exports.deleteUser = (req, res) => {
  const { userId } = req.params;
  const db = req.app.locals.db;

  const sql = `DELETE FROM users WHERE id = ?`;

  db.run(sql, [userId], function(err) {
    if (err) {
      logger.error('Error deleting user', err);
      return res.status(500).json({ error: 'Failed to delete user' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  });
};

// Change password
exports.changePassword = async (req, res) => {
  const { userId } = req.params;
  const { currentPassword, newPassword } = req.body;
  const db = req.app.locals.db;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'currentPassword and newPassword are required' });
  }

  const sql = `SELECT password_hash FROM users WHERE id = ?`;

  db.get(sql, [userId], async (err, user) => {
    if (err) {
      logger.error('Error fetching user', err);
      return res.status(500).json({ error: 'Failed to change password' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    try {
      const isValid = await comparePassword(currentPassword, user.password_hash);
      
      if (!isValid) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      const newPasswordHash = await hashPassword(newPassword);
      const updateSql = `UPDATE users SET password_hash = ? WHERE id = ?`;

      db.run(updateSql, [newPasswordHash, userId], function(err) {
        if (err) {
          logger.error('Error updating password', err);
          return res.status(500).json({ error: 'Failed to change password' });
        }

        res.json({ message: 'Password changed successfully' });
      });
    } catch (err) {
      logger.error('Error processing password change', err);
      res.status(500).json({ error: 'Failed to change password' });
    }
  });
};
