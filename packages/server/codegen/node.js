const {
    CELL_TYPE_IF_ELSE,
    CODING_MODE_SELF,
    CELL_TYPE_START,
    CELL_TYPE_END,
    CELL_TYPE_COMMON
} = require("../common/const");

const fse = require('fs-extra')




class Node {
    constructor(node, process) {
        this.raw = node;
        this.id = node.id;
        this.Process = process;
        this.isIfElse = node.type === CELL_TYPE_IF_ELSE
        this.isStart = node.type === CELL_TYPE_START
        this.isEnd = node.type === CELL_TYPE_END
        this.isCommon = node.type === CELL_TYPE_COMMON
        this.init();

    }

    getFileName() {
        return this.raw.name
    }

    getDefaultExportedName() {
        let { name } = this.raw
        return `node_${name}`
    }


    init() {
        let {
            outputDirect
        } = this.prcess;
        this.outputPath = `${outputDirect}/${this.getFileName()}.js`
    }

    getOutputPath() {
        return this.outputPath;
    }

    generateOutput() {
        let path = this.outputPath;
        let code = this.raw.codeOptions.source;
        fse.removeSync(path);
        fse.outputFileSync(path, code);
    }
}

module.exports = {
    Node
}