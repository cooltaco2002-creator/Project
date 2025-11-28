const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend from Project root
app.use(express.static(path.join(__dirname)));

const dbPath = path.join(__dirname, 'db', 'fishdata.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database at', dbPath);
        initDatabase();
    }
});

// Helper to run SQL file
function runSqlFile(fileRelativePath) {
    const filePath = path.join(__dirname, fileRelativePath);
    const sql = fs.readFileSync(filePath, 'utf8');
    return new Promise((resolve, reject) => {
        db.exec(sql, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}

// Create tables and seed data if needed
async function initDatabase() {
    try {
        await runSqlFile(path.join('db', 'create.sql'));
        await runSqlFile(path.join('db', 'createuser.sql'));
        db.get('SELECT COUNT(*) AS c FROM fishdata', [], (err, row) => {
            if (err) {
                console.error('Error counting fishdata:', err);
                return;
            }
            if (row.c === 0) {
                runSqlFile(path.join('db', 'insert.sql'))
                    .then(() => console.log('Seeded fishdata table'))
                    .catch((e) => console.error('Seeding error:', e));
            }
        });
    } catch (e) {
        console.error('Database init error:', e);
    }
}

// API Routes

// List fish with sorting (ORDER BY) and optional filtering
// ORDER BY average_length_cm DESC sorts results; WHERE filters by habitat
app.get('/api/fish', (req, res) => {
    const { habitat, sort = 'length_desc' } = req.query;
    const order = sort === 'name_asc' ? 'common_name ASC' : 'average_length_cm DESC';
    const params = [];
    let sql = 'SELECT id, common_name, scientific_name, average_length_cm, habitat FROM fishdata WHERE is_active = 1';
    if (habitat) {
        sql += ' AND habitat = ?';
        params.push(habitat);
    }
    sql += ` ORDER BY ${order}`; // Sorting identified here
    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Aggregation example: average length per habitat (GROUP BY)
// GROUP BY habitat aggregates average_length_cm via AVG function
app.get('/api/fish/summary', (req, res) => {
    const sql = `
        SELECT habitat, COUNT(*) AS species_count, AVG(average_length_cm) AS avg_length
        FROM fishdata
        WHERE is_active = 1
        GROUP BY habitat
        ORDER BY species_count DESC
    `; // GROUP BY + ORDER BY identified
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Create a fish via form input 
// Uses a transaction to insert and update timestamp atomically
app.post('/api/fish', (req, res) => {
    const { common_name, scientific_name, average_length_cm, habitat } = req.body;
    if (!common_name || !scientific_name || !average_length_cm || !habitat) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    db.serialize(() => {
        db.run('BEGIN TRANSACTION'); // Transaction start
        db.run(
            `INSERT INTO fishdata (common_name, scientific_name, average_length_cm, habitat)
             VALUES (?, ?, ?, ?)`,
            [common_name, scientific_name, Number(average_length_cm), habitat],
            function (err) {
                if (err) {
                    db.run('ROLLBACK'); // Transaction rollback on error
                    return res.status(500).json({ error: err.message });
                }
                const newId = this.lastID;
                db.run(
                    `UPDATE fishdata SET updated_at = datetime('now') WHERE id = ?`,
                    [newId],
                    (err2) => {
                        if (err2) {
                            db.run('ROLLBACK');
                            return res.status(500).json({ error: err2.message });
                        }
                        db.run('COMMIT'); // Transaction commit
                        res.json({ message: 'Fish created', id: newId });
                    }
                );
            }
        );
    });
});

// Users CRUD (partial) and join endpoint
app.post('/api/users', (req, res) => {
    const { username, email, password_hash, first_name, last_name, favorite_fish_id } = req.body;
    if (!username || !email || !password_hash) {
        return res.status(400).json({ error: 'username, email, password_hash required' });
    }
    db.run(
        `INSERT INTO users (username, email, password_hash, first_name, last_name, favorite_fish_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [username, email, password_hash, first_name || null, last_name || null, favorite_fish_id || null],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'User created', user_id: this.lastID });
        }
    );
});

// Join users with fishdata via foreign key
// INNER JOIN users.favorite_fish_id = fishdata.id returns combined results
app.get('/api/users-with-fish', (req, res) => {
    const sql = `
        SELECT u.user_id, u.username, u.email, f.common_name, f.scientific_name, f.habitat
        FROM users u
        INNER JOIN fishdata f ON u.favorite_fish_id = f.id
        WHERE u.is_active = 1 AND f.is_active = 1
        ORDER BY u.username ASC
    `; // JOIN + ORDER BY identified
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Subquery example: get fish longer than average length of all fish
// Subquery AVG(average_length_cm) used in WHERE clause
app.get('/api/fish/above-average', (req, res) => {
    const sql = `
        SELECT id, common_name, average_length_cm
        FROM fishdata
        WHERE average_length_cm > (SELECT AVG(average_length_cm) FROM fishdata)
        ORDER BY average_length_cm DESC
    `; // Subquery + ORDER BY identified
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});


