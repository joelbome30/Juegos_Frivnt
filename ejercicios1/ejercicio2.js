x = 1
y = 1123

xtype = (typeof x)
ytype = (typeof y)

if (xtype == ytype){
    if (x > y){
        alert("Tienen el mismo tipo de variable y valor y X es mayor que Y")
    }
    else if (y > x){
        alert("Tienen el mismo tipo de variable y valor y Y es mayor que X")
    }
    else if (x == y){
        alert("Tienen el mismo tipo de variable y mismo valor")
    }
    else{
        alert("Tienen el mismo tipo de variable")
    }
}
else{
    alert("No son iguales en nada")
}