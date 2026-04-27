from flask import Flask, jsonify
import psycopg2
from psycopg2.extras import RealDictCursor
import flask_cors
import os

app = Flask(__name__)
flask_cors.CORS(app)

def get_db_connection():
    conn = psycopg2.connect(
        host=os.getenv('POSTGRES_HOST'),
        database=os.getenv('POSTGRES_DB'),
        user=os.getenv('POSTGRES_USER'),
        password=os.getenv('POSTGRES_PASSWORD'),
        port=os.getenv('POSTGRES_PORT', 5432)
    )
    return conn

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy"}), 200

@app.route('/api/team', methods=['GET'])
def get_teams():
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute('SELECT id, nombre, apellido, legajo, feature, servicio, estado FROM members;')
        members = cur.fetchall()

        cur.close()
        conn.close()

        team = [dict(member) for member in members]
        return jsonify(team), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/info', methods=['GET'])
def get_info():
    return jsonify({
        "service": "backend",
        "version": "1.0.0", 
        "description": "API para gestionar miembros del equipo"
    }), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)