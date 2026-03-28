let numero = 6;
let dia = "";
let tipo = "";

switch (numero) {
    case 1:
        dia = "Lunes";
        tipo = "Día laboral";
        break;
    case 2:
        dia = "Martes";
        tipo = "Día laboral";
        break;
    case 3:
        dia = "Miércoles";
        tipo = "Día laboral";
        break;
    case 4:
        dia = "Jueves";
        tipo = "Día laboral";
        break;
    case 5:
        dia = "Viernes";
        tipo = "Día laboral";
        break;
    case 6:
        dia = "Sábado";
        tipo = "Fin de semana";
        break;
    case 7:
        dia = "Domingo";
        tipo = "Fin de semana";
        break;
    default:
        dia = "Número inválido";
        tipo = "";
}

if (tipo !== "") {
    console.log("Día: " + dia + " - " + tipo);
} else {
    console.log(dia);
}