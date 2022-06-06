

let  { Of } = require('./of');

let _of = new Of();

let containers = [
    _of
]


function getInstance(type) {
    for (let i = 0;i < containers.length;i++){
        if (containers[i].type === type) return containers[i]
    }
}

module.exports = {
    getInstance
}