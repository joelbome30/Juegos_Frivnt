x = 1
y = 12
z = 5

if (x > y && x > z){
    alert("El numero mayor es: " + x)
}
else if (y > x && y > z){
    alert("El numero mayor es: " + y)
}
else if (z > x && z > y){
    alert("El numero mayor es: " + z)
}
else if (x == y && y == z){
    alert("Los tres numeros son iguales: " + x)
}
else {
    alert("Hay un empate entre dos numeros")
}