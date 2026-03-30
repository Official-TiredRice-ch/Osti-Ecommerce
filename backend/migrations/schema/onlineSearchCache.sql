-- Online Search Cache Table
CREATE TABLE IF NOT EXISTS online_search_cache (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  query TEXT UNIQUE NOT NULL,
  results TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_online_search_cache_query ON online_search_cache(query);
CREATE INDEX IF NOT EXISTS idx_online_search_cache_created_at ON online_search_cache(created_at);
