// Datos del usuario
let edad = 15;
let suscripcion = true;

// Verificar acceso
if (edad >= 18 || suscripcion) {
    if (edad >= 18) {
        console.log("Acceso concedido: usuario mayor de edad");
    } else {
        console.log("Acceso concedido: usuario con suscripción activa");
    }
} else {
    console.log("Acceso denegado: menor de edad");
}
