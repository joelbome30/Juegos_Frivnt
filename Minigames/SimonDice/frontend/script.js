// Variables del juego
let secuencia = [];
let ronda = 0;
let paso = 0;
let jugando = false;
let bloqueado = true;
let record = localStorage.getItem('simonRecord') || 0;

// Elementos del DOM
const botones = {
    verde: document.getElementById('verde'),
    rojo: document.getElementById('rojo'),
    amarillo: document.getElementById('amarillo'),
    azul: document.getElementById('azul')
};
const startBtn = document.getElementById('startBtn');
const rondaSpan = document.getElementById('ronda');
const recordSpan = document.getElementById('record');
const mensaje = document.getElementById('mensaje');

// Mostrar record
recordSpan.textContent = record;    

function iluminar(color) {
    const boton = botones[color];
    boton.classList.add('iluminado');
    setTimeout(() => {
        boton.classList.remove('iluminado');
    }, 300);
}

function mostrarSecuencia() {
    bloqueado = true;
    mensaje.textContent = 'Turno de Simon...';
    
    let i = 0;
    const interval = setInterval(() => {
        if (i >= secuencia.length) {
            clearInterval(interval);
            bloqueado = false;
            paso = 0;
            mensaje.textContent = 'Tu turno!';
            return;
        }
        iluminar(secuencia[i]);
        i++;
    }, 600);
}

function agregarColor() {
    const colores = ['verde', 'rojo', 'amarillo', 'azul'];
    const random = colores[Math.floor(Math.random() * 4)];
    secuencia.push(random);
}

function actualizarRecord() {
    if (ronda > record) {
        record = ronda;
        recordSpan.textContent = record;
        localStorage.setItem('simonRecord', record);
    }
}

function siguienteRonda() {
    ronda++;
    rondaSpan.textContent = ronda;
    agregarColor();
    setTimeout(() => {
        mostrarSecuencia();
    }, 500);
}

function reiniciar() {
    secuencia = [];
    ronda = 0;
    paso = 0;
    jugando = true;
    rondaSpan.textContent = ronda;
    startBtn.disabled = true;
    mensaje.textContent = 'Preparando...';
    
    setTimeout(() => {
        siguienteRonda();
    }, 500);
}

function gameOver() {
    jugando = false;
    bloqueado = true;
    mensaje.textContent = 'GAME OVER!';
    startBtn.disabled = false;
    actualizarRecord();
}

// Eventos de los botones
for (let [color, boton] of Object.entries(botones)) {
    boton.addEventListener('click', () => {
        if (!jugando || bloqueado) return;
        
        iluminar(color);
        
        if (color === secuencia[paso]) {
            paso++;
            
            if (paso === secuencia.length) {
                actualizarRecord();
                mensaje.textContent = '¡Bien! Siguiente ronda';
                setTimeout(() => {
                    siguienteRonda();
                }, 1000);
            }
        } else {
            gameOver();
        }   
    });
}

startBtn.addEventListener('click', reiniciar);