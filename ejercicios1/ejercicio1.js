function estaVacio(valor) {
    if(valor == null) return true;
    if(Array.isArray(valor)) return valor.length === 0;
    if(typeof valor === "string") return valor.length === 0;
    if(typeof valor === "object") return Object.keys(valor).length === 0;
    return false;
    //verifica cada tipo de dato para ver si esta vacio
}

secreto = ""

if(estaVacio(secreto)) {
    console.log("Secreto esta vacio")
    //vacio es que no tenga nada en el valor que deberia tener la variable
}
else {
    console.log(typeof secreto)
}