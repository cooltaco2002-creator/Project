from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
import sys

# Import database helpers 
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'db'))
from app import get_db_connection, init_db, DatabaseManager, row_to_dict, is_valid_length

app = Flask(__name__, static_folder='.')
CORS(app)  # Enable CORS 

init_db()

db_manager = DatabaseManager()

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

# API Endpoints 

# GET /api/fish - List fish with sorting and optional filtering
# ORDER BY average_length_cm DESC sorts results; WHERE filters by habitat
@app.route('/api/fish', methods=['GET'])
def get_fish():
    habitat = request.args.get('habitat')
    sort = request.args.get('sort', 'length_desc')
    
    order = 'common_name ASC' if sort == 'name_asc' else 'average_length_cm DESC'
    sql = 'SELECT id, common_name, scientific_name, average_length_cm, habitat FROM fishdata WHERE is_active = 1'
    params = []
    
    if habitat:
        sql += ' AND habitat = ?'
        params.append(habitat)
    
    sql += f' ORDER BY {order}'  
    
    conn = get_db_connection()
    rows = conn.execute(sql, params).fetchall()
    conn.close()
    
    return jsonify([dict(row) for row in rows])

# GET /api/fish/summary - Aggregation example: average length per habitat (GROUP BY)
# GROUP BY habitat aggregates average_length_cm via AVG()
@app.route('/api/fish/summary', methods=['GET'])
def fish_summary():
    sql = """
        SELECT habitat, COUNT(*) AS species_count, AVG(average_length_cm) AS avg_length
        FROM fishdata
        WHERE is_active = 1
        GROUP BY habitat
        ORDER BY species_count DESC
    """  
    
    conn = get_db_connection()
    rows = conn.execute(sql).fetchall()
    conn.close()
    
    return jsonify([dict(row) for row in rows])

# POST /api/fish - Create a fish via form input (validates required fields)
# Uses a transaction to insert and update timestamp atomically
@app.route('/api/fish', methods=['POST'])
def create_fish():
    data = request.get_json()
    common_name = data.get('common_name')
    scientific_name = data.get('scientific_name')
    average_length_cm = data.get('average_length_cm')
    habitat = data.get('habitat')
    
    if not all([common_name, scientific_name, average_length_cm, habitat]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    conn = get_db_connection()
    try:
        conn.execute('BEGIN')  # Start transaction
        cursor = conn.execute(
            """INSERT INTO fishdata (common_name, scientific_name, average_length_cm, habitat)
               VALUES (?, ?, ?, ?)""",
            (common_name, scientific_name, int(average_length_cm), habitat)
        )
        new_id = cursor.lastrowid
        
        conn.execute(
            "UPDATE fishdata SET updated_at = datetime('now') WHERE id = ?",
            (new_id,)
        )
        conn.commit()  # Transaction commit
        conn.close()
        
        return jsonify({'message': 'Fish created', 'id': new_id}), 201
    except Exception as e:
        conn.execute('ROLLBACK')  # Transaction rollback on error
        conn.close()
        return jsonify({'error': str(e)}), 500

# POST /api/users - Create a user
@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password_hash = data.get('password_hash')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    favorite_fish_id = data.get('favorite_fish_id')
    
    if not all([username, email, password_hash]):
        return jsonify({'error': 'username, email, password_hash required'}), 400
    
    conn = get_db_connection()
    try:
        cursor = conn.execute(
            """INSERT INTO users (username, email, password_hash, first_name, last_name, favorite_fish_id)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (username, email, password_hash, first_name, last_name, favorite_fish_id)
        )
        conn.commit()
        conn.close()
        return jsonify({'message': 'User created', 'user_id': cursor.lastrowid}), 201
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500

# GET /api/users-with-fish - BONUS: Join users with fishdata via foreign key
# INNER JOIN users.favorite_fish_id = fishdata.id returns combined results
@app.route('/api/users-with-fish', methods=['GET'])
def users_with_fish():
    sql = """
        SELECT u.user_id, u.username, u.email, f.common_name, f.scientific_name, f.habitat
        FROM users u
        INNER JOIN fishdata f ON u.favorite_fish_id = f.id
        WHERE u.is_active = 1 AND f.is_active = 1
        ORDER BY u.username ASC
    """  
    
    conn = get_db_connection()
    rows = conn.execute(sql).fetchall()
    conn.close()
    
    return jsonify([dict(row) for row in rows])

# GET /api/fish/above-average - Subquery example: fish longer than average
# Subquery AVG(average_length_cm) used in WHERE clause
@app.route('/api/fish/above-average', methods=['GET'])
def above_average():
    sql = """
        SELECT id, common_name, average_length_cm
        FROM fishdata
        WHERE average_length_cm > (SELECT AVG(average_length_cm) FROM fishdata)
        ORDER BY average_length_cm DESC
    """ 
    
    conn = get_db_connection()
    rows = conn.execute(sql).fetchall()
    conn.close()
    
    return jsonify([dict(row) for row in rows])

# Main 

if __name__ == '__main__':
    print('Starting Flask server on http://localhost:5000')
    print('Open http://localhost:5000/index.html in your browser')
    app.run(host='0.0.0.0', port=5000, debug=True)
