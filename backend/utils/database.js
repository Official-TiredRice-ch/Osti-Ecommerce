const fs = require('fs');
const path = require('path');

// Database utility functions
class DatabaseManager {
  constructor(db) {
    this.db = db;
    this.migrationsPath = path.join(__dirname, '..', 'migrations');
  }

  // Check if a column exists in a table
  async columnExists(tableName, columnName) {
    return new Promise((resolve, reject) => {
      this.db.all(`PRAGMA table_info(${tableName})`, (err, columns) => {
        if (err) {
          reject(err);
          return;
        }
        const exists = columns.some(col => col.name === columnName);
        resolve(exists);
      });
    });
  }

  // Add a column if it doesn't exist
  async addColumnIfNotExists(tableName, columnName, columnDefinition) {
    try {
      const exists = await this.columnExists(tableName, columnName);
      
      if (!exists) {
        return new Promise((resolve, reject) => {
          console.log(`Adding ${columnName} column to ${tableName} table...`);
          this.db.run(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition}`, (err) => {
            if (err) {
              reject(err);
            } else {
              console.log(`✅ ${columnName} column added successfully`);
              resolve();
            }
          });
        });
      } else {
        console.log(`✅ ${columnName} column already exists in ${tableName}`);
        return Promise.resolve();
      }
    } catch (error) {
      throw error;
    }
  }

  // Run all pending migrations
  async runMigrations() {
    try {
      // Create migrations table if it doesn't exist
      await this.createMigrationsTable();
      
      // Get list of migration files
      const migrationFiles = fs.readdirSync(this.migrationsPath)
        .filter(file => file.endsWith('.js'))
        .sort();

      console.log(`Found ${migrationFiles.length} migration files`);

      for (const file of migrationFiles) {
        const migrationName = path.basename(file, '.js');
        
        // Check if migration already ran
        const hasRun = await this.migrationHasRun(migrationName);
        
        if (!hasRun) {
          console.log(`Running migration: ${migrationName}`);
          
          // Load and run migration
          const migration = require(path.join(this.migrationsPath, file));
          
          // Run the migration (assuming it exports functions)
          for (const [key, migrationFunc] of Object.entries(migration)) {
            if (typeof migrationFunc === 'function') {
              await migrationFunc(this.db);
            }
          }
          
          // Mark migration as completed
          await this.markMigrationComplete(migrationName);
          console.log(`✅ Migration completed: ${migrationName}`);
        } else {
          console.log(`⏭️ Migration already run: ${migrationName}`);
        }
      }
      
      console.log('All migrations completed');
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  }

  // Create migrations tracking table
  async createMigrationsTable() {
    return new Promise((resolve, reject) => {
      this.db.run(`
        CREATE TABLE IF NOT EXISTS migrations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Check if migration has been run
  async migrationHasRun(migrationName) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT name FROM migrations WHERE name = ?', [migrationName], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(!!row);
        }
      });
    });
  }

  // Mark migration as complete
  async markMigrationComplete(migrationName) {
    return new Promise((resolve, reject) => {
      this.db.run('INSERT INTO migrations (name) VALUES (?)', [migrationName], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Get current database schema info
  async getTableInfo(tableName) {
    return new Promise((resolve, reject) => {
      this.db.all(`PRAGMA table_info(${tableName})`, (err, columns) => {
        if (err) {
          reject(err);
        } else {
          resolve(columns);
        }
      });
    });
  }
}

module.exports = DatabaseManager;