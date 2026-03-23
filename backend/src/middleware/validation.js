// Middleware to validate email format
exports.validateEmail = (req, res, next) => {
  const { email } = req.body;
  
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
  }
  
  next();
};

// Middleware to validate password strength
exports.validatePassword = (req, res, next) => {
  const { password, newPassword } = req.body;
  const pwd = password || newPassword;
  
  if (pwd) {
    if (pwd.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }
    
    // Optional: Add more password requirements
    // if (!/[A-Z]/.test(pwd)) {
    //   return res.status(400).json({ error: 'Password must contain at least one uppercase letter' });
    // }
    // if (!/[a-z]/.test(pwd)) {
    //   return res.status(400).json({ error: 'Password must contain at least one lowercase letter' });
    // }
    // if (!/[0-9]/.test(pwd)) {
    //   return res.status(400).json({ error: 'Password must contain at least one number' });
    // }
  }
  
  next();
};

// Middleware to validate user role
exports.validateRole = (req, res, next) => {
  const { role } = req.body;
  
  if (role) {
    const validRoles = ['admin', 'staff', 'customer'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be admin, staff, or customer' });
    }
  }
  
  next();
};

// Middleware to validate user status
exports.validateStatus = (req, res, next) => {
  const { status } = req.body;
  
  if (status) {
    const validStatuses = ['active', 'disabled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be active or disabled' });
    }
  }
  
  next();
};
