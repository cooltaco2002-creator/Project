-- fishdata: stores fish species with varied SQL datatypes
-- INTEGER PRIMARY KEY AUTOINCREMENT: auto-incrementing unique identifier
-- TEXT: string/varchar-like type
-- INTEGER: numeric type (used here for lengths and flags)
-- TEXT DEFAULT datetime('now'): timestamp strings default to current time
CREATE TABLE IF NOT EXISTS fishdata (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    common_name             TEXT NOT NULL,
    scientific_name         TEXT NOT NULL,
    average_length_cm       INTEGER CHECK(average_length_cm > 0),
    habitat                 TEXT NOT NULL,
    created_at              TEXT DEFAULT (datetime('now')),
    updated_at              TEXT DEFAULT (datetime('now')),
    is_active               INTEGER DEFAULT 1 CHECK(is_active IN (0,1))
);

