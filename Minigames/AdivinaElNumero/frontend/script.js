//objetos HTML
let input_btn_check_obj = document.getElementById("input_btn_check")
let intentos_text_obj = document.getElementById("intentos")
let difficulty_select_obj = document.getElementById("difficulty_select")
let selected_difficulty_text = document.getElementById("selected_difficulty")
let rango_text_obj = document.getElementById("rango_info")
let temporizador_text_obj = document.getElementById("temporizador")
let number_input_obj = document.getElementById("number_input")
// SoundManager para manejar sonidos superpuestos
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
//generar numero
let secret_number = random_number(1, 10)
console.log("Número secreto:", secret_number)
// variables del juego
let intentos_set = 5
let intentos = intentos_set
intentos_text_obj.textContent = intentos
let dificultad_actual = "noob"
let min_rango = 1
let max_rango = 10
let temporizador
let tiempo_restante = 30
// configuración de dificultades
const dificultades = {
    "noob": [8, 1, 10, "Noob"],
    "facil": [7, 1, 15, "Fácil"],
    "medio": [5, 1, 30, "Medio"],
    "dificil": [3, 1, 100, "Difícil"],
    "insano": [2, 1, 150, "Insano"],
    "imposible": [1, 1, 300, "Imposible"],
    "???": [1, 1, 500, "???"]
}
// actualizar interfaz inicial
if (rango_text_obj) rango_text_obj.textContent = "1 - 10"
if (selected_difficulty_text) selected_difficulty_text.textContent = "Noob (1-10, 8)"
if (temporizador_text_obj) temporizador_text_obj.textContent = "⏱️ 30s"
// temporizador
function iniciarTemporizador() {
    clearInterval(temporizador)
    tiempo_restante = 30
    if (temporizador_text_obj) temporizador_text_obj.textContent = "⏱️ " + tiempo_restante + "s"
    temporizador = setInterval(() => {
        tiempo_restante--
        if (temporizador_text_obj) temporizador_text_obj.textContent = "⏱️ " + tiempo_restante + "s"
        if (tiempo_restante <= 0) {
            clearInterval(temporizador)
            intentos -= 1
            intentos_text_obj.textContent = intentos
            soundManager.play('denied'); // Sonido de error por tiempo agotado
            alert("¡Se acabó el tiempo! Te quedan " + intentos + " intentos")
            if (intentos <= 0) {
                soundManager.play('lose'); // Sonido de perder
                alert("Perdiste! El número era: " + secret_number)
                location.href = "perdiste.html"
                return
            }
            iniciarTemporizador()
        }
    }, 1000)
}
// cambiar dificultad
if (difficulty_select_obj) {
    difficulty_select_obj.addEventListener('change', () => {
        let selected = difficulty_select_obj.value
        let data = dificultades[selected]
        
        dificultad_actual = selected
        intentos_set = data[0]
        min_rango = data[1]
        max_rango = data[2]
        intentos = intentos_set
        secret_number = random_number(min_rango, max_rango)
        
        intentos_text_obj.textContent = intentos
        if (rango_text_obj) rango_text_obj.textContent = min_rango + " - " + max_rango
        if (selected_difficulty_text) {
            selected_difficulty_text.textContent = data[3] + " (" + min_rango + "-" + max_rango + ", " + intentos + ")"
        }
        
        console.log("Nuevo número secreto:", secret_number)
        clearInterval(temporizador)
        iniciarTemporizador()
    })
}
// poner solo numeros en los input que lo requieran
function justNumbers(e){
    var keynum = window.event ? window.event.keyCode : e.which;
    if ((keynum == 8) || (keynum == 46))
        return true;
    
    return /\d/.test(String.fromCharCode(keynum));
}
//funcion de nuero random
function random_number(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min
}
// click boton
input_btn_check_obj.addEventListener('click', () => {
    // detener temporizador mientras se procesa
    clearInterval(temporizador)

    // convertir a numero
    let number_input = Number(document.getElementById("number_input").value)

    // ver si esta vacio
    if (isNaN(number_input)) {
        soundManager.play('denied'); // Sonido de error por input vacío
        alert("Ingresa un número válido")
        document.getElementById("number_input").value = ""
        iniciarTemporizador()
        return
    }
    
    // verificar rango
    if (number_input < min_rango || number_input > max_rango) {
        soundManager.play('denied'); // Sonido de error por rango incorrecto
        alert("El número debe estar entre " + min_rango + " y " + max_rango)
        document.getElementById("number_input").value = ""
        iniciarTemporizador()
        return
    }
    
    // comprobaciones de numero
    if (number_input === secret_number){
        soundManager.play('money'); // Sonido de acierto
        alert("¡Acertaste!")
        secret_number = random_number(min_rango, max_rango)
        console.log("Número secreto:", secret_number)
        alert("Intenta adivinar denuevo")
        intentos = intentos_set
        intentos_text_obj.textContent = intentos
        document.getElementById("number_input").value = ""
    }
    else if (number_input < secret_number){
        soundManager.play('denied'); // Sonido de error
        alert("El número es mayor")
        intentos -= 1
        intentos_text_obj.textContent = intentos
        document.getElementById("number_input").value = ""
    }
    else {
        soundManager.play('denied'); // Sonido de error
        alert("El número es menor")
        intentos -= 1
        intentos_text_obj.textContent = intentos
        document.getElementById("number_input").value = ""
    }
    console.log("Intentos: " + intentos)
    
    // verificar si perdió y mostrar número
    if (intentos <= 0){
        soundManager.play('lose'); // Sonido de perder
        alert("Perdiste! El número era: " + secret_number)
        location.href = "perdiste.html";
        return
    }
    
    // reiniciar temporizador
    iniciarTemporizador()
})

// iniciar temporizador al cargar
iniciarTemporizador()