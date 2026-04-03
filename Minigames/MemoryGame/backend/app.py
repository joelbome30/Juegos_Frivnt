from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
from supabase import create_client

# Cargamos las variables secretas del archivo .env
load_dotenv()

# Obtenemos las credenciales de Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Creamos la conexión con la base de datos de Supabase (si están disponibles las credenciales)
supabase = None
if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    except Exception as e:
        print(f"Error conectando a Supabase: {e}")
        supabase = None

# Creamos nuestra aplicación Flask
app = Flask(__name__)

# Activamos CORS para que el frontend se pueda conectar al backend
CORS(app)

# Ruta para verificar que el servidor está funcionando
@app.get('/ping')
def ping():
    return jsonify(ok=True, message="pong")

# Ruta para guardar el puntaje de un jugador
@app.post("/score")
def save_score():
    # Recibimos los datos que envió el frontend en formato JSON
    data = request.get_json(silent=True) or {}
    
    # Extraemos el nombre del jugador y eliminamos espacios extras
    player = (data.get("player") or "").strip()
    
    # Extraemos el nombre del juego y eliminamos espacios extras
    game = (data.get("game") or "").strip()
    
    # Extraemos el puntaje
    score = data.get("score")
    
    # Validaciones
    if player == "":
        return jsonify(ok=False, error="player vacío"), 400
    
    if game == "":
        return jsonify(ok=False, error="game vacío"), 400
    
    if score is None:
        return jsonify(ok=False, error="score vacío"), 400
    
    # Intentamos guardar el puntaje en la base de datos
    if supabase is None:
        # Si no hay conexión a Supabase, simulamos guardado exitoso
        print(f"Puntaje simulado guardado: {player} - {game} - {score}")
        return jsonify(ok=True, message="Puntaje guardado (simulado - no hay conexión a BD)")
    
    try:
        response = supabase.table("scores").insert({
            "player": player,
            "game": game,
            "score": score
        }).execute()
        
        return jsonify(ok=True, message="Puntaje guardado correctamente")
    
    except Exception as e:
        print(f"Error al guardar el puntaje: {e}")
        return jsonify(ok=False, error="Error interno del servidor"), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)