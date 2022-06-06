let _ = require('lodash');
let {
    parse
} = require("@babel/parser")

const traverse = require('@babel/traverse').default;
const execa = require('execa')



let {
    DSL_BASE_URL,
    CELL_TYPE_START
} = require('../common/const')


const fse = require('fs-extra')


function generateStartNodeCode(node) {
    let {
        codeOptions
    } = node;
    return `export default async function() {

    }`
}

async function generateCodeByDsl(config) {

    let deps = [];
    let needInstallDeps = [];
    let {
        name,
        nodes
    } = config;
    let directory = `${DSL_BASE_URL}/src/dsl/${name}`
    let pkg = require(`${DSL_BASE_URL}/package.json`);

    let result = {
        success: false,
        message: ''
    }

    try {

        async function addDepInPkg() {
            let packages = Object.keys(Object.assign(pkg.dependencies || {}, pkg.devDependencies || {}))
            
            deps.forEach((dep) => {
                if (!packages.includes(dep)) needInstallDeps.push(dep)
            })

            if (needInstallDeps.length) {
                console.log(`开始安装依赖`)
               let  { stdout } =  await execa.command(`npm --prefix ${DSL_BASE_URL} install ${needInstallDeps.join(' ')} --d`);
                console.log(stdout);           
            }
        }

        async function _parse(code) {

            try {
                ast = parse(code, {
                    ecmaVersion: 6,
                    sourceType: 'module'
                });
            } catch (err) {
                return result.message = "parse code error"
            }

            traverse(ast, {
                'ImportDeclaration': (path) => {
                    const node = path.node;
                    const source = node.source.value;
                    if (/^\./.test(source)) return;
                    if (deps.includes(source)) return true;
                    deps.push(source)
                }

            })

        }

        fse.removeSync(directory);
        for (node of nodes) {
            let {
                name,
                id,
                type
            } = node;
            let path = `${directory}/${name}.js`
            let code;
            if (type === CELL_TYPE_START) {
                code = generateStartNodeCode(node)
            } else {
                code = node.codeOptions.source;
                _parse(code);
                await addDepInPkg();
            }

            fse.removeSync(path);
            fse.outputFileSync(path, code);
        }

      
    } catch (err) {
        result.message = err.message
        return result
    }
    result.success = true;

    return result;

}

module.exports = {
    generateCodeByDsl
}