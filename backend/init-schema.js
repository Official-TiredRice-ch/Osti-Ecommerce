/**
 * Initialize Database Schema
 * Automatically creates all tables from SQL files in migrations/schema/
 * 
 * Usage: node init-schema.js
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { createAllTables, verifyTables } = require('./utils/schemaManager');

const dbPath = path.join(__dirname, 'database', 'ecommerce.db');
const schemaDir = path.join(__dirname, 'migrations', 'schema');   

console.log('🚀 Database Schema Initializer\n');
console.log('Database:', dbPath);
console.log('Schema Directory:', schemaDir);
console.log('='.repeat(50) + '\n');

const db = new sqlite3.Database(dbPath, async (err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.message);
    process.exit(1);
  }

  try {
    // Create all tables from schema files
    const results = await createAllTables(db, schemaDir);
    
    // Verify tables were created
    await verifyTables(db);
    
    // Close database connection
    db.close((err) => {
      if (err) {
        console.error('❌ Error closing database:', err.message);
      } else {
        console.log('✅ Database schema initialization complete!\n');
        
        if (results.failed > 0) {
          console.log('⚠️  Some tables failed to create. Check the errors above.');
          process.exit(1);
        }
      }
    });
  } catch (error) {
    console.error('❌ Fatal error:', error);
    db.close();
    process.exit(1);
  }
});
