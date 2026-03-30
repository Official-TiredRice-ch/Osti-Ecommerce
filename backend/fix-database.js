const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'ecommerce.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to database');
  fixDatabase();
});

function fixDatabase() {
  // Check if search_history table exists
  db.all("SELECT name FROM sqlite_master WHERE type='table' AND name='search_history'", (err, tables) => {
    if (err) {
      console.error('Error checking tables:', err);
      return;
    }

    if (tables.length === 0) {
      console.log('Creating search_history table...');
      createSearchHistoryTable();
    } else {
      console.log('search_history table exists, checking columns...');
      checkAndFixColumns();
    }
  });
}

function createSearchHistoryTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS search_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      query TEXT NOT NULL,
      result_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
    
    CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history(user_id);
    CREATE INDEX IF NOT EXISTS idx_search_history_query ON search_history(query);
    CREATE INDEX IF NOT EXISTS idx_search_history_created_at ON search_history(created_at);
  `;

  db.exec(sql, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('✅ search_history table created successfully');
    }
    createOnlineSearchCacheTable();
  });
}

function checkAndFixColumns() {
  db.all("PRAGMA table_info(search_history)", (err, columns) => {
    if (err) {
      console.error('Error checking columns:', err);
      return;
    }

    const columnNames = columns.map(col => col.name);
    console.log('Existing columns:', columnNames);

    if (!columnNames.includes('query')) {
      console.log('Adding missing query column...');
      db.run("ALTER TABLE search_history ADD COLUMN query TEXT", (err) => {
        if (err) {
          console.error('Error adding query column:', err);
        } else {
          console.log('✅ query column added');
        }
        createOnlineSearchCacheTable();
      });
    } else {
      console.log('✅ query column already exists');
      createOnlineSearchCacheTable();
    }
  });
}

function createOnlineSearchCacheTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS online_search_cache (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      query TEXT UNIQUE NOT NULL,
      results TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_online_search_cache_query ON online_search_cache(query);
    CREATE INDEX IF NOT EXISTS idx_online_search_cache_created_at ON online_search_cache(created_at);
  `;

  db.exec(sql, (err) => {
    if (err) {
      console.error('Error creating online_search_cache table:', err);
    } else {
      console.log('✅ online_search_cache table created successfully');
    }
    cleanup();
  });
}

function cleanup() {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('✅ Database fixed successfully!');
    }
    process.exit(0);
  });
}
