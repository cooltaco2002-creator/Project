const express = require('express');

const sqlite3 = require('sqlite3').verbose();

const cors = require('cors');

const path = require('path');


const app = express();

const PORT = 3000;


// Middleware

app.use(cors());

app.use(express.json());

app.use(express.static('public'));


// Initialize SQLite database

const db = new sqlite3.Database('./tasks.db', (err) => {

    if (err) {

        console.error('Error opening database:', err);

    } else {

        console.log('Connected to SQLite database');

        initDatabase();

    }

});


// Create table if it doesn't exist

function initDatabase() {

    db.run(`

        CREATE TABLE IF NOT EXISTS tasks (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            name TEXT NOT NULL,

            description TEXT,

            priority INTEGER,

            status TEXT DEFAULT 'pending',

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP

        )

    `, (err) => {

        if (err) {

            console.error('Error creating table:', err);

        } else {

            console.log('Tasks table ready');

        }

    });

}


// API Routes


// Get all tasks

app.get('/api/tasks', (req, res) => {

    db.all('SELECT * FROM tasks ORDER BY priority DESC, created_at DESC', [], (err, rows) => {

        if (err) {

            res.status(500).json({ error: err.message });

            return;

        }

        res.json({ tasks: rows });

    });

});


// Get single task

app.get('/api/tasks/:id', (req, res) => {

    db.get('SELECT * FROM tasks WHERE id = ?', [req.params.id], (err, row) => {

        if (err) {

            res.status(500).json({ error: err.message });

            return;

        }

        res.json({ task: row });

    });

});


// Create new task

app.post('/api/tasks', (req, res) => {

    const { name, description, priority, status } = req.body;

   

    if (!name) {

        res.status(400).json({ error: 'Task name is required' });

        return;

    }

   

    db.run(

        'INSERT INTO tasks (name, description, priority, status) VALUES (?, ?, ?, ?)',

        [name, description || '', priority || 3, status || 'pending'],

        function(err) {

            if (err) {

                res.status(500).json({ error: err.message });

                return;

            }

            res.json({

                message: 'Task created successfully',

                id: this.lastID

            });

        }

    );

});


// Update task

app.put('/api/tasks/:id', (req, res) => {

    const { name, description, priority, status } = req.body;

   

    db.run(

        'UPDATE tasks SET name = ?, description = ?, priority = ?, status = ? WHERE id = ?',

        [name, description, priority, status, req.params.id],

        function(err) {

            if (err) {

                res.status(500).json({ error: err.message });

                return;

            }

            res.json({

                message: 'Task updated successfully',

                changes: this.changes

            });

        }

    );

});


// Delete task

app.delete('/api/tasks/:id', (req, res) => {

    db.run('DELETE FROM tasks WHERE id = ?', [req.params.id], function(err) {

        if (err) {

            res.status(500).json({ error: err.message });

            return;

        }

        res.json({

            message: 'Task deleted successfully',

            changes: this.changes

        });

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

