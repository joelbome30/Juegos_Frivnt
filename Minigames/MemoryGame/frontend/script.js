// Elementos del DOM
let gameBoard, scoreDisplay, restartBtn;

// Estado del juego
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let attempts = 0;
let gameLocked = false;
let playerName = ""; // Nombre del jugador

// Símbolos para las cartas (8 pares)
const symbols = ['🍎', '🍌', '🍇', '🍓', '🥝', '🍑', '🍍', '🍒'];

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
        const response = await fetch('http://localhost:5001/score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                player: playerName,
                game: 'memorygame',
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

// Función para mezclar un array (algoritmo Fisher-Yates)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Función para crear las cartas
function createCards() {
    // Crear pares de cartas
    const cardSymbols = [...symbols, ...symbols]; // Duplicar para pares
    const shuffledSymbols = shuffle(cardSymbols);

    shuffledSymbols.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        card.textContent = '?'; // Mostrar interrogación inicialmente
        card.addEventListener('click', handleCardClick);
        gameBoard.appendChild(card);
        cards.push(card);
    });
}

// Función para mostrar vista previa de las cartas
function showPreview() {
    gameLocked = true; // Bloquear clics durante la vista previa

    // Revelar todas las cartas
    cards.forEach(card => {
        card.classList.add('flipped');
        card.textContent = card.dataset.symbol;
    });

    // Después de 2 segundos, ocultar todas las cartas
    setTimeout(() => {
        cards.forEach(card => {
            card.classList.remove('flipped');
            card.textContent = '?'; // Volver a mostrar interrogación
        });
        gameLocked = false; // Desbloquear clics
    }, 2000);
}

// Función para manejar el clic en una carta
function handleCardClick(event) {
    const card = event.target;

    // Ignorar si el juego está bloqueado, la carta ya está volteada o ya está emparejada
    if (gameLocked || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }

    // Voltear la carta
    card.classList.add('flipped');
    card.textContent = card.dataset.symbol;
    flippedCards.push(card);

    // Si hay dos cartas volteadas, verificar si coinciden
    if (flippedCards.length === 2) {
        gameLocked = true;
        attempts++;

        const [card1, card2] = flippedCards;

        if (card1.dataset.symbol === card2.dataset.symbol) {
            // Coinciden: marcar como emparejadas
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;

            // Verificar si el juego terminó
            if (matchedPairs === symbols.length) {
                setTimeout(() => {
                    alert(`¡Felicidades! Has completado el juego en ${attempts} intentos.`);
                    // Calcular puntaje: menos intentos = mejor puntaje
                    const score = Math.max(10, 100 - attempts * 5);
                    guardarPuntaje(score);
                }, 500);
            }

            flippedCards = [];
            gameLocked = false;
        } else {
            // No coinciden: voltear de vuelta después de un delay
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                card1.textContent = '?';
                card2.textContent = '?';
                flippedCards = [];
                gameLocked = false;
            }, 1000);
        }

        // Actualizar el contador de intentos
        scoreDisplay.textContent = `Intentos: ${attempts}`;
    }
}

// Función para reiniciar el juego
function restartGame() {
    // Limpiar el tablero
    gameBoard.innerHTML = '';
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    attempts = 0;
    gameLocked = false;

    // Actualizar el contador
    scoreDisplay.textContent = 'Intentos: 0';

    // Crear nuevas cartas
    createCards();

    // Mostrar vista previa
    showPreview();
}

// Función para inicializar el juego
function initializeGame() {
    // Inicializar elementos del DOM
    gameBoard = document.getElementById('game-board');
    scoreDisplay = document.getElementById('score');
    restartBtn = document.getElementById('reiniciar');
    
    if (!gameBoard) {
        console.error('No se encontró el elemento game-board');
        return;
    }
    
    // Event listener para el botón de reiniciar
    if (restartBtn) {
        restartBtn.addEventListener('click', restartGame);
    }
    
    restartGame();
}

// Inicializar el juego cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame);
} else {
    // DOM ya está listo
    initializeGame();
}