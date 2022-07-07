

let generateCode = require('./generateCode')

let handleModuleCode = require('./handleModuleCode')

module.exports = [
    new generateCode(),
    new handleModuleCode(),
]