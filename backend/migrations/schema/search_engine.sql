CREATE TABLE search_engines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    base_url TEXT,
    api_key TEXT,
    provider TEXT,
    is_active INTEGER DEFAULT 1,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_search_engines_name ON search_engines(name);

CREATE TRIGGER trg_search_engines_updated_at
AFTER UPDATE ON search_engines
FOR EACH ROW
WHEN NEW.updated_at <= OLD.updated_at
BEGIN
    UPDATE search_engines
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;