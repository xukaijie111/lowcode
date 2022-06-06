
let { VITE_BASE_URL } = require('../common/const')
let { Node } = require('./node')

class Process{
    constructor(dsl) {
        this.dsl = dsl;
        this.outputDirect = ""
        this.init();
        this.nodes = []
        
    }

    init() {
        let { id,name ,nodes} = dsl
        this.outputDirect = `${VITE_BASE_URL}/${name}`
        nodes.forEach(node => {
            this.nodes.push(new Node(node,this))
        });

    }

    generateOuptput() {
        this.nodes.forEach(node => {
           node.generateOutput();
        });
    }

}

module.exports = {
    Process
}