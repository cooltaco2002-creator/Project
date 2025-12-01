# Project — Fish Finder Full-Stack Application

## Running the Application

You can run this application with **either** Node.js (Express) **or** Python (Flask) backend.

### Option 1: Flask Backend (Python)

```powershell
Push-Location 'c:\Users\coolt\OneDrive\Documents\GitHub\Project\Project'
pip install -r requirements.txt
python app.py
```

Open in browser: `http://localhost:5000/index.html`

### Option 2: Express Backend (Node.js)

```powershell
Push-Location 'c:\Users\coolt\OneDrive\Documents\GitHub\Project\Project'
npm install
node server.js
```

Open in browser: `http://localhost:3000/index.html`

**Note:** Both backends use the same SQLite database (`db/fishdata.db`) and expose identical REST API endpoints.

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

## Architecture & Separation of Concerns

This application maintains separation of concerns across backend and frontend layers:

**Backend Options:**
- **Flask (Python)**: `app.py` in Project root
  - Routes: REST API endpoints for fish, users, summary, join, subquery
  - Database layer: `db/app.py` provides `get_db_connection()` and `init_db()` helpers
  - Static serving: Serves HTML/CSS/JS from Project root
  
- **Express (Node.js)**: `server.js` in Project root
  - Routes: Identical REST API endpoints
  - Database layer: Inline SQLite connection with `db.exec()` for SQL file execution
  - Static serving: Serves from Project root via `express.static()`

**Frontend:**
- `index.html`: Main page with data display containers and fish creation form
- `app.js`: Fetches data from `/api/*` endpoints and renders dynamically
- `script.js`: Original "Fish of the Day" logic (unchanged)
- Uses relative URLs so works with both backends without modification

**Database:**
- `db/fishdata.db`: SQLite database (shared by both backends)
- `db/create.sql`: `fishdata` table schema
- `db/createuser.sql`: `users` table schema
- `db/insert.sql`: Seed data for `fishdata`
- `db/app.py`: Python database helpers (Flask only)

### Changes to Existing Files

**Modified:**
- `db/app.py`: Refactored from Flask routes to database helper module
  - **Before:** Full Flask app with form routes and template rendering
  - **After:** Pure database layer with `get_db_connection()`, `init_db()` helpers
  - **Purpose:** Separation of concerns—database logic isolated from routing

- `Project/app.js`: Already existed; no changes needed
  - Uses relative API paths (`/api/fish`) that work with both Flask and Express

**New Files:**
- `Project/app.py`: Flask application entry point (full-stack runner)
- `Project/requirements.txt`: Python dependencies (Flask, flask-cors)

**Unchanged:**
- `server.js`: Express backend (continues to work alongside Flask option)
- `index.html`, `script.js`, CSS, images: Frontend remains identical
- SQL files in `db/`: Schema and seed data shared by both backends