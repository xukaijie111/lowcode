
export {}
const babel = require('@babel/core');

interface ICatchError {
    message:string
}

function generateId(len = 10){
    let s = ""
    while(len--) {
        s+=Math.round(Math.random()*10);
    }
    return s
}

function tryTransformCode(source:string) {
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
            errorMsg:(err as ICatchError).message
        }
    }

    return { success :true}
  
}

module.exports = {
    generateId,
    tryTransformCode
}