

try{
    const rm = require('rimraf');
    let { targets } = require('./utils')
    const path = require('path');
    
    rm(path.resolve(__dirname,'../node_modules'),(err)=>{console.log(err)})
    
    targets.forEach((target) => {
        rm(path.resolve(__dirname,`../packages/${target}/node_modules`),()=>{})
    })
}catch(err) {
    console.log(err)
    process.exit()
}
