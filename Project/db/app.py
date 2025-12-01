"""
db/app.py - Database layer for Flask backend
Provides DB connection and helper functions for Fish Finder application.
"""
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'fishdata.db')
# ========== CLASS ==========
# CLASS: DatabaseManager encapsulates database operations
# This class organizes related database functions and maintains the connection path
class DatabaseManager:
    """
    Database manager class for handling SQLite connections and operations.
    Provides methods for connection management and data retrieval.
    """
    
    def __init__(self, db_path=DB_PATH):
        """Initialize with database path."""
        self.db_path = db_path
    
    def get_connection(self):
        """
        Return a connection to the SQLite database with row factory.
        
        Exception handling: Catches SQLite connection errors and provides
        a user-friendly error message if the database cannot be accessed.
        """
        try:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            return conn
        except sqlite3.Error as e:
            print(f"Database connection error: {e}")
            raise
    
    def get_fish_by_habitat(self, habitat):
        """
        Retrieve fish filtered by habitat.
        
        Conditional statment: Checks if habitat parameter is provided.
        If habitat is None or empty, returns all fish; otherwise filters by habitat.
        """
        conn = self.get_connection()
        
        # Conditional statement: If habitat is provided, filter; otherwise return all
        if habitat and habitat.strip():
            sql = 'SELECT * FROM fishdata WHERE habitat = ? AND is_active = 1'
            rows = conn.execute(sql, (habitat,)).fetchall()
        else:
            sql = 'SELECT * FROM fishdata WHERE is_active = 1'
            rows = conn.execute(sql).fetchall()
        
        conn.close()
        return rows

# ========== LAMBDA FUNCTION ==========
# Lambda: Anonymous function to transform database rows into dictionaries
# Takes a sqlite3.Row object and converts it to a plain dictionary for JSON serialization
row_to_dict = lambda row: dict(row) if row else None

# Lambda: Filter function to validate fish length (used in data processing)
# Checks if average_length_cm is a positive integer; returns True if valid
is_valid_length = lambda length: isinstance(length, int) and length > 0

# ========== HELPER FUNCTIONS ==========

def get_db_connection():
    """
    Return a connection to the SQLite database with row factory.
    
    Exeception handling: Wraps connection attempt in try-except to catch errors.
    If connection fails, logs error and returns None instead of crashing.
    """
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn
    except sqlite3.Error as e:
        print(f"Error connecting to database: {e}")
        return None

def init_db():
    """
    Initialize database tables from SQL files if they don't exist.
    
    Exception handling: Catches file I/O errors and SQL execution errors
    to prevent application crashes during database initialization.
    """
    try:
        conn = get_db_connection()
        if not conn:
            print("Failed to initialize database: no connection")
            return
        
        cursor = conn.cursor()
        
        try:
            with open(os.path.join(os.path.dirname(__file__), 'create.sql'), 'r') as f:
                conn.executescript(f.read())
        except FileNotFoundError as e:
            # Exception handling: If SQL file is missing, print error but continue
            print(f"Warning: create.sql not found - {e}")
        
        try:
            with open(os.path.join(os.path.dirname(__file__), 'createuser.sql'), 'r') as f:
                conn.executescript(f.read())
        except FileNotFoundError as e:
            # Exception handling: If SQL file is missing, print error but continue
            print(f"Warning: createuser.sql not found - {e}")
        
        # Conditional statement: Check if fishdata table needs seeding
        # If table is empty (count = 0), load initial data from insert.sql
        cursor.execute('SELECT COUNT(*) FROM fishdata')
        count = cursor.fetchone()[0]
        
        if count == 0:  
            try:
                with open(os.path.join(os.path.dirname(__file__), 'insert.sql'), 'r') as f:
                    conn.executescript(f.read())
                print('Seeded fishdata table')
            except FileNotFoundError as e:
                print(f"Warning: insert.sql not found - {e}")
        
        conn.commit()
        conn.close()
        print('Database initialized successfully')
        
    except Exception as e:
        # Exception handling: Catch any unexpected errors during initialization
        print(f"Error initializing database: {e}")