/**
 * Schema Manager
 * Automatically creates database tables from SQL schema files
 */

const fs = require('fs');
const path = require('path');

/**
 * Read all SQL files from the schema directory
 * @param {string} schemaDir - Path to schema directory
 * @returns {Array} Array of {filename, sql} objects
 */
function readSchemaFiles(schemaDir) {
  const files = fs.readdirSync(schemaDir);
  const sqlFiles = files.filter(file => file.endsWith('.sql') && file !== 'README.md');
  
  return sqlFiles.map(file => {
    const filePath = path.join(schemaDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    return { filename: file, sql };
  });
}

/**
 * Execute a SQL schema file
 * @param {Object} db - Database connection
 * @param {string} filename - Name of the SQL file
 * @param {string} sql - SQL content
 * @returns {Promise}
 */
function executeSchema(db, filename, sql) {
  return new Promise((resolve, reject) => {
    // Remove comments and empty lines
    const cleanSQL = sql
      .split('\n')
      .filter(line => !line.trim().startsWith('--') && line.trim() !== '')
      .join('\n')
      .trim();

    if (!cleanSQL) {
      resolve({ filename, status: 'skipped', message: 'Empty or comment-only file' });
      return;
    }

    db.run(cleanSQL, (err) => {
      if (err) {
        reject({ filename, error: err.message });
      } else {
        // Extract table name from CREATE TABLE statement
        const tableMatch = cleanSQL.match(/CREATE TABLE (?:IF NOT EXISTS )?(\w+)/i);
        const tableName = tableMatch ? tableMatch[1] : 'unknown';
        resolve({ filename, tableName, status: 'success' });
      }
    });
  });
}

/**
 * Create all tables from schema files
 * @param {Object} db - Database connection
 * @param {string} schemaDir - Path to schema directory
 * @returns {Promise}
 */
async function createAllTables(db, schemaDir) {
  console.log('📋 Schema Manager: Reading schema files...\n');
  
  const schemaFiles = readSchemaFiles(schemaDir);
  
  if (schemaFiles.length === 0) {
    console.log('⚠️  No SQL schema files found in', schemaDir);
    return { success: 0, failed: 0, skipped: 0 };
  }

  console.log(`Found ${schemaFiles.length} schema file(s):\n`);
  
  const results = {
    success: 0,
    failed: 0,
    skipped: 0,
    details: []
  };

  for (const { filename, sql } of schemaFiles) {
    try {
      const result = await executeSchema(db, filename, sql);
      
      if (result.status === 'success') {
        console.log(`✅ ${filename} → Table '${result.tableName}' created`);
        results.success++;
      } else if (result.status === 'skipped') {
        console.log(`⏭️  ${filename} → ${result.message}`);
        results.skipped++;
      }
      
      results.details.push(result);
    } catch (error) {
      console.log(`❌ ${error.filename} → Error: ${error.error}`);
      results.failed++;
      results.details.push(error);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`📊 Summary: ${results.success} created, ${results.failed} failed, ${results.skipped} skipped`);
  console.log('='.repeat(50) + '\n');

  return results;
}

/**
 * Verify all tables exist in the database
 * @param {Object} db - Database connection
 * @returns {Promise}
 */
function verifyTables(db) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
      (err, tables) => {
        if (err) {
          reject(err);
        } else {
          console.log('📋 Tables in database:');
          tables.forEach(table => {
            console.log(`   - ${table.name}`);
          });
          console.log('');
          resolve(tables);
        }
      }
    );
  });
}

module.exports = {
  readSchemaFiles,
  executeSchema,
  createAllTables,
  verifyTables
};
