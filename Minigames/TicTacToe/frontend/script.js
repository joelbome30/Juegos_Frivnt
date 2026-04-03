// Botones de tic tac toe
const btn_1_obj = document.getElementById('btn-1');
const btn_2_obj = document.getElementById('btn-2');
const btn_3_obj = document.getElementById('btn-3');
const btn_4_obj = document.getElementById('btn-4');
const btn_5_obj = document.getElementById('btn-5');
const btn_6_obj = document.getElementById('btn-6');
const btn_7_obj = document.getElementById('btn-7');
const btn_8_obj = document.getElementById('btn-8');
const btn_9_obj = document.getElementById('btn-9');
// Botones del juego
let reiniciar_obj = document.getElementById("reiniciar");
let juegoTerminado = false; // Control para saber si el juego acabó
let playerName = ""; // Nombre del jugador

// Lista para seleccionarlos mas facil
const btns = [
  btn_1_obj,
  btn_2_obj,
  btn_3_obj,
  btn_4_obj,
  btn_5_obj,
  btn_6_obj,
  btn_7_obj,
  btn_8_obj,
  btn_9_obj,
];

// Combinaciones ganadoras (3 en raya)
const combinacionesGanadoras = [
  // Filas
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columnas
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonales
  [0, 4, 8],
  [2, 4, 6]
];

// Función para verificar victoria
function verificarVictoria() {
  for (let combinacion of combinacionesGanadoras) {
    const [a, b, c] = combinacion;
    const valorA = btns[a].textContent;
    const valorB = btns[b].textContent;
    const valorC = btns[c].textContent;
    
    // Si los tres valores son iguales y no están vacíos
    if (valorA !== '' && valorA === valorB && valorB === valorC) {
      return valorA; // Retorna 'X' o 'O' (el ganador)
    }
  }
  return null; // No hay ganador aún
}

// Función para solicitar nombre del jugador
async function solicitarNombre() {
    return new Promise((resolve) => {
        const nombre = prompt("Ingresa tu nombre para guardar tu puntaje:");
        if (nombre && nombre.trim() !== "") {
            playerName = nombre.trim();
            resolve(true);
        } else {
            resolve(false);
        }
    });
}

// Función para guardar puntaje en el backend
async function guardarPuntaje(score) {
    if (!playerName) {
        const nombreIngresado = await solicitarNombre();
        if (!nombreIngresado) {
            return; // No guardar si no hay nombre
        }
    }

    try {
        const response = await fetch('http://localhost:5000/score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                player: playerName,
                game: 'tictactoe',
                score: score
            })
        });

        const result = await response.json();

        if (result.ok) {
            console.log('Puntaje guardado exitosamente');
        } else {
            console.error("Error al guardar puntaje:", result.error);
        }
    } catch (error) {
        console.error("Error de conexión:", error);
    }
}

function aiChoose(){
    let randomNum;
    let btn;
    let intentos = 0;
    let maxIntentos = 20; // Límite para evitar congelamiento
    
    // Buscar una casilla vacía al azar
    do {
        randomNum = getRandomInt(1, 10); // 1-9
        btn = document.getElementById(`btn-${randomNum}`);
        intentos++;
    } while (btn.textContent !== '' && intentos < maxIntentos);
    
    // Si todas las casillas están llenas, no hacer nada
    if (btn.textContent !== '') {
        console.log('Tablero lleno - Juego terminado');
        return null;
    }
    
    // Marcar la casilla con 'O' (IA)
    btn.textContent = 'O';
    
    // Verificar si la IA gana
    let ganador = verificarVictoria();
    if (ganador) {
        console.log(`¡${ganador === 'O' ? 'IA' : 'Jugador'} gana!`);
        juegoTerminado = true;
        return randomNum;
    }
    
    return randomNum;
}
// Añadir event listener de click a cada boton/div
btns.forEach((btn, index) => {
  if (!btn) return;
  btn.addEventListener('click', () => {
    // Evitar más movimientos si el juego terminó
    if (juegoTerminado) {
        alert('Juego terminado. Reinicia para jugar de nuevo');
        return;
    }
    
    // Verificar si la casilla ya está marcada
    if (btn.textContent !== '') {
        console.log(`Boton ${index + 1} ya está marcado`);
        return;
    }
    
    console.log(`Boton ${index + 1} Clickeado`);
    btn.textContent = 'X';
    
    // Verificar si el jugador gana
    let ganador = verificarVictoria();
    if (ganador) {
        console.log(`¡${ganador === 'X' ? 'Jugador' : 'IA'} gana!`);
        juegoTerminado = true;
        // Guardar puntaje: 10 si gana el jugador, 0 si gana la IA
        const score = ganador === 'X' ? 10 : 0;
        guardarPuntaje(score);
        return; // No dejar que la IA juegue si ya ganó
    }
    
    // Verificar si hay empate
    if (btns.every(b => b.textContent !== '')) {
        console.log('¡Empate!');
        juegoTerminado = true;
        guardarPuntaje(5); // 5 puntos por empate
        return;
    }
    
    aiChoose();
    
    // Verificar si la IA gana después de su movimiento
    ganador = verificarVictoria();
    if (ganador) {
        console.log(`¡${ganador === 'O' ? 'IA' : 'Jugador'} gana!`);
        juegoTerminado = true;
        // Guardar puntaje: 10 si gana el jugador, 0 si gana la IA
        const score = ganador === 'X' ? 10 : 0;
        guardarPuntaje(score);
    }
  });
});

// Botón reiniciar - fuera del forEach para no repetirse
if (reiniciar_obj) {
  reiniciar_obj.addEventListener('click', () => {
    // Limpiar todas las casillas
    btns.forEach(btn => {
      btn.textContent = '';
    });
    // Resetear el estado del juego
    juegoTerminado = false;
    console.logs('Juego reiniciado');
  });
}
// Notesé que también en este caso `min` será incluido y `max` excluido
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}