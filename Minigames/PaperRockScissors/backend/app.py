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
        return jsonify(ok=False, error="score faltante"), 400
    
    # Intentamos convertir el puntaje a número entero
    try:
        score = int(score)
    except ValueError:
        return jsonify(ok=False, error="score inválido"), 400
    
    # Verificamos que el puntaje no sea negativo
    if score < 0:
        return jsonify(ok=False, error="score no puede ser negativo"), 400
    
    # Guardamos el puntaje en la tabla "scores" de la base de datos
    if supabase is None:
        # Si no hay conexión a Supabase, simulamos guardado exitoso
        print(f"Puntaje simulado guardado: {player} - {game} - {score}")
        return jsonify(ok=True, inserted={})
    
    try:
        resp = supabase.table("scores").insert({
            "player": player,
            "game": game,
            "score": score
        }).execute()
        
        # Devolvemos una respuesta exitosa
        return jsonify(ok=True, inserted=resp.data[0] if resp.data else {})
        
    except Exception as e:
        return jsonify(ok=False, error=str(e)), 500

@app.get("/leaderboard")
def leaderboard():
    # Obtenemos el nombre del juego desde los parámetros de la URL
    game = (request.args.get("game") or "").strip()
    # Verificamos que el nombre del juego no esté vacío
    if game == "":
        return jsonify(ok=False, error="falta game en query ?game="),400
    # Buscamos en la base de datos los puntajes del juego solicitado
    # Seleccionamos el jugador, puntaje y fecha de creación
    # Filtramos solo los puntajes del juego especificado
    # Los ordenamos de mayor a menor puntaje
    # Limitamos los resultados a solo 5
    if supabase is None:
        # Si no hay conexión a Supabase, devolvemos datos simulados
        return jsonify(ok=True, game=game, top5=[
            {"player": "Jugador1", "score": 50, "created_at": "2024-01-01"},
            {"player": "Jugador2", "score": 40, "created_at": "2024-01-01"},
            {"player": "Jugador3", "score": 30, "created_at": "2024-01-01"}
        ])
    
    resp = (supabase.table("scores")
    .select("player, score, created_at")
    .eq("game", game)
    .order("score", desc=True)
    .limit(5)
    .execute())
    # Devolvemos los 5 mejores puntajes encontrados
    return jsonify(ok=True, game=game, top5=resp.data)

if __name__ == "__main__":
    app.run(debug=True, port=5003)
 