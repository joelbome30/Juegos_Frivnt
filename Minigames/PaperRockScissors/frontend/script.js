//objetos html
let cpu_answer_obj = document.getElementById("cpu_answer")
let player_choice_obj = document.getElementById("player_choice")
let cpu_points_obj = document.getElementById("cpu_points_obj")
let player_points_obj = document.getElementById("player_points_obj")
let piedra_btn_obj = document.getElementById("piedra_btn")
let papel_btn_obj = document.getElementById("papel_btn")
let tijera_btn_obj = document.getElementById("tijera_btn")
let timer_obj = document.getElementById("timer_obj")
let result_message_obj = document.getElementById("result-message")
//sonidos
let tieSound = document.getElementById("tieSound")
//puntos
let cpu_points = 0
let player_points = 0
let playerName = ""; // Nombre del jugador

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
        const response = await fetch('http://localhost:5003/score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                player: playerName,
                game: 'paperrockscissors',
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
//timer
let timer = null
let tiempo_restante = 20
//opciones
let options = ["piedra","papel","tijera"]
//elegidos del jugador y cpu
player_choice = ""
cpu_choice = ""
//funcion de random cpu
function cpuChoice() {
    let cpu_choice = options[Math.floor(Math.random() * options.length)]
    if (cpu_choice == "piedra") {
        cpu_answer_obj.textContent = "🪨"
    }
    else if (cpu_choice == "papel") {
        cpu_answer_obj.textContent = "📝"
    }
    else if (cpu_choice == "tijera") {
        cpu_answer_obj.textContent = "✂️"
    }
    return cpu_choice
}

//funcion para comprobar ganador
function checkWinner() {
    if (player_choice == cpu_choice){
        result_message_obj.textContent = "¡Empate!"
        result_message_obj.style.color = "#ff9800"
        tieSound.currentTime = 0
        tieSound.play()
    }
    else if (player_choice == "piedra" && cpu_choice == "papel"){
        result_message_obj.textContent = "¡CPU ganó!"
        result_message_obj.style.color = "#d32f2f"
        cpu_points++
        cpu_points_obj.textContent = cpu_points
    }
    else if (player_choice == "piedra" && cpu_choice == "tijera"){
        result_message_obj.textContent = "¡Ganaste!"
        result_message_obj.style.color = "#388e3c"
        player_points++
        player_points_obj.textContent = player_points
    }
    else if (player_choice == "papel" && cpu_choice == "piedra"){
        result_message_obj.textContent = "¡Ganaste!"
        result_message_obj.style.color = "#388e3c"
        player_points++
        player_points_obj.textContent = player_points
    }
    else if (player_choice == "papel" && cpu_choice == "tijera"){
        result_message_obj.textContent = "¡CPU ganó!"
        result_message_obj.style.color = "#d32f2f"
        cpu_points++
        cpu_points_obj.textContent = cpu_points
    }
    else if (player_choice == "tijera" && cpu_choice == "piedra"){
        result_message_obj.textContent = "¡CPU ganó!"
        result_message_obj.style.color = "#d32f2f"
        cpu_points++
        cpu_points_obj.textContent = cpu_points
    }
    else if (player_choice == "tijera" && cpu_choice == "papel"){
        result_message_obj.textContent = "¡Ganaste!"
        result_message_obj.style.color = "#388e3c"
        player_points++
        player_points_obj.textContent = player_points
    }

    if (player_points == 5) {
        result_message_obj.textContent = "¡Ganaste la partida! 🎉"
        result_message_obj.style.color = "#388e3c"
        alert("¡Felicidades! ¡Ganaste la partida!")
        guardarPuntaje(50); // Victoria
        // Reiniciar contadores
        player_points = 0
        cpu_points = 0
        player_points_obj.textContent = 0
        cpu_points_obj.textContent = 0
    }
    if (cpu_points == 5){
        result_message_obj.textContent = "CPU ganó la partida"
        result_message_obj.style.color = "#d32f2f"
        guardarPuntaje(0); // Derrota
        // Reiniciar contadores
        player_points = 0
        cpu_points = 0
        player_points_obj.textContent = 0
        cpu_points_obj.textContent = 0
    }
}

//funcion para resetear temporizador
function resetTimer() {
    clearTimeout(timer)
    startTimer()
}

//funcion para iniciar temporizador
function startTimer() {
    tiempo_restante = 20
    timer_obj.textContent = tiempo_restante
    let contador = setInterval(() => {
        if (tiempo_restante > 0) {
            tiempo_restante--
            timer_obj.textContent = tiempo_restante
        }
        else {
            clearInterval(contador)
            // Si el jugador no eligió, se le asigna una opción aleatoria
            let random_choice = options[Math.floor(Math.random() * options.length)]
            player_choice = random_choice
            
            if (random_choice == "piedra") {
                player_choice_obj.textContent = "🪨"
            }
            else if (random_choice == "papel") {
                player_choice_obj.textContent = "📝"
            }
            else if (random_choice == "tijera") {
                player_choice_obj.textContent = "✂️"
            }
            
            cpu_choice = cpuChoice()
            checkWinner()
            resetTimer()
        }
    }, 1000)
}

//listener piedra btn
piedra_btn_obj.addEventListener("click", ()=> {
    player_choice = "piedra"
    player_choice_obj.textContent = "🪨"
    cpu_choice = cpuChoice()
    checkWinner()
    resetTimer()
})

//listener papel btn
papel_btn_obj.addEventListener("click", ()=> {
    player_choice = "papel"
    player_choice_obj.textContent = "📝"
    cpu_choice = cpuChoice()
    checkWinner()
    resetTimer()
})

//listener tijera btn
tijera_btn_obj.addEventListener("click", ()=> {
    player_choice = "tijera"
    player_choice_obj.textContent = "✂️"
    cpu_choice = cpuChoice()
    checkWinner()
    resetTimer()
})

//iniciar temporizador
startTimer()