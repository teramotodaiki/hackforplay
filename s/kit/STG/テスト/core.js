


var Class = function()
{
    this.value = 100;
}

Class.prototype.change = function()
{
    this.value = 200;
}


var V1 = new Class();

console.log(V1);

V1.change();

var V2 = new Class();


console.log(V2);
