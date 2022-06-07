
const babel = require('@babel/core');

function generateId(len = 10){
    let s = ""
    while(len--) {
        s+=Math.round(Math.random()*10);
    }
    return s
}

function tryTransformCode(source) {
    try{
        babel.transformSync(source, {
            plugins: [['@babel/plugin-proposal-decorators', { legacy: true }], ['@babel/plugin-proposal-class-properties']],
            ast: true,
            babelrc: false,
            configFile: false,
          }).ast;

    }catch(err) {
        return {
            success:false,
            errorMsg:err.message
        }
    }

    return { success :true}
  
}

module.exports = {
    generateId,
    tryTransformCode
}