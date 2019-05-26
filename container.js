const dependable = require('dependable');
const path = require('path');
const container = dependable.container();



const simpleDependecies = [

    ['_','lodash'],
    ['mongoose','mongoose'],
    ['async','async']
]


simpleDependecies.forEach((val) =>{
        container.register(val[0], function(){ return require(val[1])})
})



container.load(path.join(__dirname,'/helpers'))

container.load(path.join(__dirname,'/controllers'))

 
container.register('container',function() { return container})


 module.exports = container