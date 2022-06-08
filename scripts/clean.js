

try{
    const rm = require('rimraf');
    let { targets } = require('./utils')
    const path = require('path');
    
    rm(path.resolve(__dirname,'../node_modules'),()=>{})
    
    rm(path.resolve(__dirname,'../server/node_modules'),()=>{})
    targets.forEach((target) => {
        rm(path.resolve(__dirname,`../packages/${target}/node_modules`),()=>{})
    })
}catch(err) {
    process.exit()
}
