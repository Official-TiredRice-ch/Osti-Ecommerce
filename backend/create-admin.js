const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { hashPassword } = require('./utils/password');

const dbPath = path.join(__dirname, 'database', 'ecommerce.db');
const db = new sqlite3.Database(dbPath);

async function createAdminUser() {
  const username = 'admin';
  const email = 'admin@osti.com';
  const password = 'admin123'; // Change this to a secure password
  const role = 'admin';

  try {
    const password_hash = await hashPassword(password);
    
    const sql = `
      INSERT INTO users (username, email, password_hash, role, status)
      VALUES (?, ?, ?, ?, 'active')
    `;

    db.run(sql, [username, email, password_hash, role], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          console.log('❌ Admin user already exists!');
          console.log('\nExisting admin credentials:');
          console.log('Email: admin@osti.com');
          console.log('Password: admin123 (or your custom password)');
        } else {
          console.error('❌ Error creating admin user:', err.message);
        }
      } else {
        console.log('✅ Admin user created successfully!');
        console.log('\n========================================');
        console.log('Admin Login Credentials:');
        console.log('========================================');
        console.log('Email:    admin@osti.com');
        console.log('Password: admin123');
        console.log('Role:     admin');
        console.log('========================================');
        console.log('\n⚠️  IMPORTANT: Change this password after first login!');
      }
      
      db.close();
    });
  } catch (error) {
    console.error('❌ Error:', error);
    db.close();
  }
}

createAdminUser();
