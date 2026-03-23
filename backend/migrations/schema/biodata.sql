CREATE TABLE biodata (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,

    first_name TEXT,
    last_name TEXT,
    middle_name TEXT,
    phone TEXT,
    address TEXT,
    date_of_birth DATE,
    gender TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TRIGGER trg_biodata_updated_at
AFTER UPDATE ON biodata
FOR EACH ROW
WHEN NEW.updated_at <= OLD.updated_at
BEGIN
    UPDATE biodata
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = OLD.id;
END;