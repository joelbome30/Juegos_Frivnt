// Número secreto
let numeroSecreto = 10;

// Intentos predefinidos (simulación)
let intentos = [3, 7, 10, 5];

for (let i = 0; i < intentos.length; i++) {
    console.log("Intento " + (i + 1) + ": " + intentos[i]);

    if (intentos[i] === numeroSecreto) {
        console.log("Número encontrado en el intento " + (i + 1));
        break; // Detiene el ciclo cuando lo encuentra
    }
}