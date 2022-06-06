

let {
    checkDeps
} = require('./utils')
 class Of {
    constructor() {
        this.type = "of"
    }

    checkValid(form) {
        let { defaultCode,codeType,deps ,name ,type } = form; 

        
        let ret = checkDeps(deps)
        if (!ret.result) return ret;

        return {
            result:true,
            deps:ret.data
        }

    }
}

module.exports = { Of }