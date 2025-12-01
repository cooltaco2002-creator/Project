"""
db/app.py - Database layer for Flask backend
Provides DB connection and helper functions; maintains separation of concerns.
"""
import sqlite3
import os

# Path to SQLite database (relative to Project root)
DB_PATH = os.path.join(os.path.dirname(__file__), 'fishdata.db')

def get_db_connection():
    """Return a connection to the SQLite database with row factory."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize database tables from SQL files if they don't exist."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Read and execute create.sql
    with open(os.path.join(os.path.dirname(__file__), 'create.sql'), 'r') as f:
        conn.executescript(f.read())
    
    # Read and execute createuser.sql
    with open(os.path.join(os.path.dirname(__file__), 'createuser.sql'), 'r') as f:
        conn.executescript(f.read())
    
    # Seed fishdata if empty
    cursor.execute('SELECT COUNT(*) FROM fishdata')
    if cursor.fetchone()[0] == 0:
        with open(os.path.join(os.path.dirname(__file__), 'insert.sql'), 'r') as f:
            conn.executescript(f.read())
        print('Seeded fishdata table')
    
    conn.commit()
    conn.close()
    print('Database initialized')