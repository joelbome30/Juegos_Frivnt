let nota = 67;
let mensaje = "";

if(nota >= 90) {
    mensaje = "Excelente ";
}
else if(nota >= 70) {
    mensaje = "Bueno";
    if(nota >= 85) {
        mensaje = "Bueno. Está cerca de ser Excelente ";
    }
}
else if(nota >= 50) {
    mensaje = "Aceptable";
    if(nota >= 65) {
        mensaje = "Aceptable. Está cerca de ser Bueno ";
    }
}
else {
    mensaje = "Deficiente";
    if(nota >= 45) {
        mensaje = "Deficiente. Está cerca de ser Aceptable ";
    }
}

console.log("Calificación: " + mensaje);
console.log("Nota: " + nota )