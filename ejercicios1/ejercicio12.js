// Número a evaluar
let numero = 24;

// Variables para guardar resultados
let tipoParidad = "";
let tipoSigno = "";
let tipoRango = "";

// Evaluar par o impar
if (numero % 2 === 0) {
    tipoParidad = "par";
} else {
    tipoParidad = "impar";
}

// Evaluar positivo, negativo o cero
if (numero > 0) {
    tipoSigno = "positivo";
} else if (numero < 0) {
    tipoSigno = "negativo";
} else {
    tipoSigno = "cero";
}

// Evaluar rango (ejemplo: entre 10 y 100)
if (numero >= 10 && numero <= 100) {
    tipoRango = "está dentro del rango permitido";
} else {
    tipoRango = "está fuera del rango permitido";
}

// Resultado final
console.log(`El número es ${tipoParidad}, ${tipoSigno} y ${tipoRango}`);