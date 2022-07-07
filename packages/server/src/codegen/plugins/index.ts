

let generateCode = require('./generateCode')

let handleModuleCode = require('./handleModuleCode')

let installPackageDeps = require('./installPackageDep')

module.exports = [
    new generateCode(),
    new handleModuleCode(),
    new installPackageDeps()
]