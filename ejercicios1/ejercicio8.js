let suma = 0;

for(let i = 1; i <= 50; i++) {
    if(i % 2 === 0 && i > 10) {
        suma = suma + i;
    }
}

console.log("La suma total es: " + suma);