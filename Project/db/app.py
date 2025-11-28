from flask import Flask, render_template, request, redirect
import sqlite3
from datetime import datetime

app = Flask(__name__)

# ---------- Helper Functions ----------

def get_fish_species():
    """Fetch all fish common names from fishdata table."""
    conn = sqlite3.connect('mydatabase.db')
    cursor = conn.cursor()
    cursor.execute("SELECT common_name FROM fishdata ORDER BY common_name ASC")
    species = [row[0] for row in cursor.fetchall()]
    conn.close()
    return species

def save_observation(form_data):
    """Insert observation into observations table."""
    conn = sqlite3.connect('mydatabase.db')
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO observations (
            name, email, date, species, contact_methods, count, location, notes, consent
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        form_data['name'],
        form_data['email'],
        form_data['date'] or str(datetime.now().date()),
        form_data['species'],
        ','.join(form_data.getlist('contact')),  # store multiple selections as CSV
        form_data.get('count') or 0,
        form_data.get('location'),
        form_data.get('notes'),
        1 if form_data.get('consent') == 'yes' else 0
    ))
    conn.commit()
    conn.close()

# ---------- Routes ----------

@app.route('/submit-observation', methods=['GET', 'POST'])
def observation_form():
    if request.method == 'POST':
        save_observation(request.form)
        return redirect('/submit-observation')  # reload page after submission
    
    species_list = get_fish_species()
    return render_template('observation_form.html', species_list=species_list)

# ---------- Main ----------

if __name__ == "__main__":
    app.run(debug=True)