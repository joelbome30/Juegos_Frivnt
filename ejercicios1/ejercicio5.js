let secreto;

if(secreto === null) {
    console.log("Secreto es null")
}
else if(secreto === undefined) {
    console.log("Secreto es undefined")
}
else if(typeof secreto === "number" && isNaN(secreto)) {
    console.log("Secreto es NaN")
}
else {
    console.log("Tipo: " + typeof secreto + ", Valor: " + secreto)
}