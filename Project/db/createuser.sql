-- users: application users; includes a foreign key to fishdata for joinability
-- UNIQUE constraints provide data validation; CHECK restricts is_active
CREATE TABLE IF NOT EXISTS users (
    user_id         INTEGER PRIMARY KEY AUTOINCREMENT,
    favorite_fish_id INTEGER,
    username        TEXT NOT NULL UNIQUE,
    email           TEXT NOT NULL UNIQUE,
    password_hash   TEXT NOT NULL,
    first_name      TEXT,
    last_name       TEXT,
    created_at      TEXT DEFAULT (datetime('now')),
    updated_at      TEXT DEFAULT (datetime('now')),
    is_active       INTEGER DEFAULT 1 CHECK(is_active IN (0,1)),
    FOREIGN KEY (favorite_fish_id) REFERENCES fishdata(id) ON DELETE SET NULL ON UPDATE CASCADE
);

