# Project
To make it run 

Install dependencies and start the server:

Push-Location 'c:\Users\coolt\OneDrive\Documents\GitHub\Project\Project'
npm install
node server.js


Open the app in your browser:

Start-Process 'http://localhost:3000/index.html'

## Data Dictionary

**Tables**
- **`fishdata`**: Catalog of fish species.
- **`users`**: Application users with optional favorite fish.

**fishdata**
- `id`: INTEGER, primary key, auto-increment.
- `common_name`: TEXT, required (NOT NULL).
- `scientific_name`: TEXT, required (NOT NULL).
- `average_length_cm`: INTEGER, required; validation `CHECK(average_length_cm > 0)`.
- `habitat`: TEXT, required (NOT NULL).
- `created_at`: TEXT, default `datetime('now')`.
- `updated_at`: TEXT, default `datetime('now')`.
- `is_active`: INTEGER, default 1; validation `CHECK(is_active IN (0,1))`.

**users**
- `user_id`: INTEGER, primary key, auto-increment.
- `favorite_fish_id`: INTEGER, nullable; foreign key to `fishdata.id` (`ON DELETE SET NULL`, `ON UPDATE CASCADE`).
- `username`: TEXT, required; unique.
- `email`: TEXT, required; unique.
- `password_hash`: TEXT, required.
- `first_name`: TEXT, optional.
- `last_name`: TEXT, optional.
- `created_at`: TEXT, default `datetime('now')`.
- `updated_at`: TEXT, default `datetime('now')`.
- `is_active`: INTEGER, default 1; validation `CHECK(is_active IN (0,1))`.

**Relationships**
- `users.favorite_fish_id` → `fishdata.id` (many users can reference one fish).

**Indexes & Constraints**
- Primary keys: `fishdata.id`, `users.user_id`.
- Unique: `users.username`, `users.email`.
- Validation (CHECK): `fishdata.is_active`, `users.is_active`, `fishdata.average_length_cm`.
- Defaults: `created_at`, `updated_at` timestamps via SQLite `datetime('now')`.

**Common Queries**
- List fish (sorted): `GET /api/fish` uses `ORDER BY average_length_cm DESC` or `common_name ASC`.
- Summary by habitat: `GET /api/fish/summary` uses `GROUP BY habitat` with `AVG(average_length_cm)`.
- Above-average fish: `GET /api/fish/above-average` uses a subquery `WHERE average_length_cm > (SELECT AVG(...))`.
- Users and favorite fish: `GET /api/users-with-fish` uses `INNER JOIN users.favorite_fish_id = fishdata.id`.

**Transactions**
- Creating a fish via `POST /api/fish` runs a transaction: `BEGIN` → `INSERT` → `UPDATE updated_at` → `COMMIT`, with `ROLLBACK` on error.

## Entity Relationship Diagram (ERD)

```
+---------------------+           +---------------------+
|       fishdata      |           |        users        |
|---------------------|           |---------------------|
| id (PK)             |<-----+    | user_id (PK)        |
| common_name (TEXT)  |      |    | favorite_fish_id FK |
| scientific_name     |      +----| username (UNIQUE)   |
| average_length_cm   |           | email (UNIQUE)      |
| habitat             |           | password_hash       |
| created_at (DEFAULT)|           | first_name          |
| updated_at (DEFAULT)|           | last_name           |
| is_active (CHECK)   |           | created_at (DEFAULT)|
|                     |           | updated_at (DEFAULT)|
|                     |           | is_active (CHECK)   |
+---------------------+           +---------------------+

Relationship:
- users.favorite_fish_id → fishdata.id
	- Type: Optional many-to-one (many users can reference one fish)
	- On delete: SET NULL (keeps user, clears favorite)
	- On update: CASCADE (keeps referential integrity if fish id changes)
```