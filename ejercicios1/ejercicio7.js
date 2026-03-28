function esMultiplo(numero, divisor) {
  return numero % divisor === 0;
}
var num = 0
var interval = setInterval(() => {
    num++
    if (esMultiplo(num, 3)){
        console.log("Fizz")
    }
    else if (esMultiplo(num, 5)){
        console.log("Buzz")
    }
    else if (esMultiplo(num, 5) && esMultiplo(num, 3)){
        console.log("FizzBuzz")
    }
    else{
        console.log(num)
    }
}, 600);