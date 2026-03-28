// Valores iniciales
let a = 1;
let b = 1;

console.log(a);
console.log(b);

// Generar los siguientes
for (let i = 3; i <= 10; i++) {
    let siguiente = a + b;
    console.log(siguiente);

    // Actualizar valores
    a = b;
    b = siguiente;
}
