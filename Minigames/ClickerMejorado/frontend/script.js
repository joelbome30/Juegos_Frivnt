const btnClicker = document.getElementById("btnClicker")
const nClicks = document.getElementById("nClicks")
const nivelObj = document.getElementById("nivel")
const incrementoObj = document.getElementById("incremento")
const clicksReqParaUpgradeObj = document.getElementById("clicksReqParaUpgrade")
const timerObj = document.getElementById("timer")
// SoundManager para manejar sonidos superpuestos
// Nombre del jugador (se solicitará al inicio)
let playerName = ""
const soundManager = {
    sounds: {},
    
    // Cargar un sonido
    loadSound(name, url, volume = 0.5) {
        // Crear template para clonar
        const template = new Audio(url);
        template.volume = volume;
        template.preload = 'auto';
        
        this.sounds[name] = {
            template: template,
            volume: volume
        };
    },
    
    // Reproducir sonido (se puede superponer)
    play(name) {
        if (!this.sounds[name]) {
            console.error(`Sonido "${name}" no encontrado`);
            return;
        }
        
        // Clonar el template
        const sound = this.sounds[name].template.cloneNode();
        sound.volume = this.sounds[name].volume;
        
        // Reproducir
        sound.play().catch(e => {
            // Ignorar errores de autoplay policy
        });
        
        // Limpiar cuando termine
        sound.onended = () => {
            sound.remove();
        };
    }
};
// Cargar sonidos
soundManager.loadSound('money', 'sonidos/money_sfx.mp3', 0.5);
soundManager.loadSound('denied', 'sonidos/denied_sfx.mp3', 0.4);
soundManager.loadSound('levelup', 'sonidos/lvl_up_sfx.wav', 0.6);
soundManager.loadSound('win', 'sonidos/winner_sfx.mp3', 0.6);
soundManager.loadSound('lose', 'sonidos/loser_sfx.mp3', 0.6);

let contador = 0
let incremento = 1
let clicksReqParaUpgrade = 10
let nivel = 1

let timer = 0
let clicksPorSegundo = 0
let juegoTerminado = false

// Pedir nombre al inicio del juego
function solicitarNombreInicial() {
    let name = "";
    while (true) {
        name = prompt("Ingresa tu nombre de jugador:");
        if (name === null) {
            // Si cancela, confirmar si quiere jugar como 'Anon'
            const usarAnon = confirm("¿Deseas jugar como 'Anon'? Pulsa Aceptar para usar 'Anon' o Cancelar para volver a escribir nombre.");
            if (usarAnon) {
                playerName = "Anon";
                break;
            } else {
                continue;
            }
        }
        name = name.trim();
        if (name !== "") {
            playerName = name;
            break;
        }
    }
    
    // Mostrar instrucciones después de ingresar el nombre
    alert("Tienes que llegar a nivel 100 en 1 minuto")
}

// Ejecutar cuando la página esté completamente cargada
window.addEventListener('load', () => {
    solicitarNombreInicial();
});

// Click
btnClicker.addEventListener("click", () => {
    if (juegoTerminado) return

    contador += incremento

    // Verificar niveles
    if (contador >= clicksReqParaUpgrade) {
        nivel++
        soundManager.play('levelup');
        clicksReqParaUpgrade *= 4
        incremento *= 2
    }

    // Actualizar textos en html
    nClicks.textContent = contador
    nivelObj.textContent = nivel
    incrementoObj.textContent = incremento
    clicksReqParaUpgradeObj.textContent = clicksReqParaUpgrade
})
// Mejoras
function mejora1() {
    if (contador >= 200) {
        soundManager.play('money');
        contador -= 200
        clicksPorSegundo += 1
        nClicks.textContent = contador
    }
    else{
        soundManager.play('denied');
    }
}
function mejora2() {
    if (contador >= 600) {
        soundManager.play('money');
        contador -= 600
        clicksPorSegundo += 5
        nClicks.textContent = contador
    }
    else{
        soundManager.play('denied');
    }
}
function mejora3() {
    if (contador >= 1200) {
        soundManager.play('money');
        contador -= 1200
        clicksPorSegundo += 10
        nClicks.textContent = contador
    }
    else{
        soundManager.play('denied');
    }
}
function mejora4() {
    if (contador >= 500 && timer < 60) {
        soundManager.play('money');
        contador -= 500
        timer -= 30
        if (timer > 60) timer = 60 // Limitar a 60 segundos máximo
        nClicks.textContent = contador
        timerObj.textContent = timer
    }
    else{
        soundManager.play('denied');
    }
}
// Auto Clicks por segundo
setInterval(() => {
    if (juegoTerminado) return

    contador += clicksPorSegundo
    nClicks.textContent = contador
    
    // Verificar si se puede subir de nivel con producción automática
    if (contador >= clicksReqParaUpgrade) {
        nivel++
        soundManager.play('levelup');
        clicksReqParaUpgrade *= 4
        incremento *= 2
        
        // Actualizar UI
        nivelObj.textContent = nivel
        incrementoObj.textContent = incremento
        clicksReqParaUpgradeObj.textContent = clicksReqParaUpgrade
    }
}, 1000)
// Timer
const timerInterval = setInterval(() => {
    if (juegoTerminado) return
    timer++
    timerObj.textContent = timer

    if (nivel >= 100) {
        juegoTerminado = true
        clearInterval(timerInterval)
        pantallaGanaste()
    }

    if (timer >= 60) {
        juegoTerminado = true
        clearInterval(timerInterval)
        pantallaPerdiste()
    }
}, 1000)

function pantallaPerdiste() {
    // Detener el juego
    juegoTerminado = true;
    guardarPuntaje();
}

async function guardarPuntaje() {
    // Usar el nombre ya solicitado al inicio; si está vacío, volver a pedir
    if (!playerName || playerName.trim() === "") {
        await solicitarNombreInicial();
    }

    if (!playerName || playerName.trim() === "") {
        reiniciarJuego();
        return;
    }

    try {
        // Enviar el puntaje al backend
        const response = await fetch('http://localhost:5000/score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                player: playerName.trim(),
                game: 'clicker',
                score: contador
            })
        });

        const result = await response.json();

        if (result.ok) {
            // Puntaje guardado exitosamente
            mostrarPantallaFinal(playerName, nivel >= 100);
        } else {
            alert("Error al guardar puntaje: " + result.error);
            reiniciarJuego();
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error de conexión con el servidor");
        reiniciarJuego();
    }
}

async function mostrarPantallaFinal(playerName, ganaste) {
    // Ocultar toda la interfaz
    document.body.innerHTML = '';
    const screen = document.createElement('div');
    
    // Fondo
    Object.assign(screen.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        backgroundColor: ganaste ? '#001a00' : '#000000',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '99999',
        overflowY: 'auto',
        padding: '20px'
    });
    
    // Texto principal
    const texto = document.createElement('div');
    texto.textContent = ganaste ? '¡Ganaste!' : 'Perdistes';
    Object.assign(texto.style, {
        color: ganaste ? '#00ff00' : '#ffffff',
        fontSize: '60px',
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '5px',
        marginBottom: '20px'
    });
    screen.appendChild(texto);

    // Información del jugador
    const info = document.createElement('div');
    info.textContent = `Jugador: ${playerName} | Puntaje: ${contador} | Nivel: ${nivel}`;
    Object.assign(info.style, {
        color: '#ffffff',
        fontSize: '20px',
        marginBottom: '30px'
    });
    screen.appendChild(info);

    // Obtener y mostrar leaderboard
    try {
        const response = await fetch('http://localhost:5000/leaderboard?game=clicker');
        const result = await response.json();

        if (result.ok && result.top5) {
            const leaderboardDiv = document.createElement('div');
            leaderboardDiv.innerHTML = '<h2 style="color: #ffffff; margin: 20px 0;">Top 5 Mejores Puntajes</h2>';
            
            const table = document.createElement('table');
            Object.assign(table.style, {
                color: '#ffffff',
                borderCollapse: 'collapse',
                marginBottom: '30px'
            });

            // Encabezados
            const headerRow = table.insertRow();
            ['Posición', 'Jugador', 'Puntaje'].forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                Object.assign(th.style, {
                    border: '1px solid #ffffff',
                    padding: '10px',
                    textAlign: 'left'
                });
                headerRow.appendChild(th);
            });

            // Datos
            result.top5.forEach((score, index) => {
                const row = table.insertRow();
                const cells = [
                    index + 1,
                    score.player,
                    score.score
                ];
                cells.forEach(cellData => {
                    const td = document.createElement('td');
                    td.textContent = cellData;
                    Object.assign(td.style, {
                        border: '1px solid #ffffff',
                        padding: '10px'
                    });
                    row.appendChild(td);
                });
            });

            leaderboardDiv.appendChild(table);
            screen.appendChild(leaderboardDiv);
        }
    } catch (error) {
        console.error("Error al obtener leaderboard:", error);
    }

    // Botón para reiniciar
    const reiniciarBtn = document.createElement('button');
    reiniciarBtn.textContent = 'Reiniciar';
    Object.assign(reiniciarBtn.style, {
        padding: '15px 30px',
        fontSize: '20px',
        cursor: 'pointer',
        backgroundColor: '#444444',
        color: '#ffffff',
        border: 'none',
        borderRadius: '5px',
        marginTop: '20px'
    });
    reiniciarBtn.addEventListener('click', reiniciarJuego);
    screen.appendChild(reiniciarBtn);

    document.body.appendChild(screen);
    
    if (ganaste) {
        soundManager.play("win");
    } else {
        soundManager.play("lose");
    }
}

function reiniciarJuego() {
    document.location.reload();
}

function pantallaGanaste() {
    // Detener el juego
    juegoTerminado = true;
    guardarPuntaje();
}




// Añadir: cada vez el tiempo suba mas rapido cada 5 niveles
// Tambien que puedas subir el tiempo limite
